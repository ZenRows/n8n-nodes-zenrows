const test = require('node:test');
const assert = require('node:assert/strict');

const { Zenrows } = require('../dist/nodes/Zenrows/Zenrows.node.js');

const description = new Zenrows().description;
const props = description.properties;

/**
 * n8n expressions are strings of the form `={{ <js> }}`. These helpers compile
 * the JavaScript inside so a test can run it, which is the only way to catch a
 * broken expression: TypeScript compiles one happily and the linter does not
 * read inside the braces.
 */
const PURE = /^=\{\{([\s\S]*)\}\}$/;

function compile(expr) {
	const m = PURE.exec(expr.trim());
	assert.ok(m, `not a pure expression: ${expr}`);
	return new Function('$value', '$response', '$parameter', `return (${m[1]});`);
}

/** Every `{{ ... }}` fragment in a string, whether or not the string is pure. */
function fragments(expr) {
	return [...expr.matchAll(/\{\{([\s\S]*?)\}\}/g)].map((m) => m[1]);
}

/** Walk every property, including the ones nested inside collections. */
function* walk(list) {
	for (const p of list) {
		yield p;
		if (Array.isArray(p.options)) {
			for (const o of p.options) {
				if (o && typeof o === 'object' && 'name' in o && 'type' in o) yield o;
			}
		}
	}
}

const operations = props.filter((p) => p.name === 'operation');

test('every expression in the node parses as JavaScript', () => {
	const seen = [];
	const collect = (value, where) => {
		if (typeof value !== 'string' || !value.includes('{{')) return;
		for (const frag of fragments(value)) {
			seen.push(where);
			assert.doesNotThrow(
				() => new Function('$value', '$response', '$parameter', `return (${frag});`),
				`expression does not parse at ${where}: ${frag}`,
			);
		}
	};

	for (const p of walk(props)) {
		collect(p.routing?.send?.value, `${p.name}.routing.send.value`);
		collect(p.routing?.output?.maxResults, `${p.name}.routing.output.maxResults`);
		collect(p.routing?.send?.paginate, `${p.name}.routing.send.paginate`);
	}
	for (const op of operations) {
		for (const o of op.options) {
			collect(o.routing?.request?.url, `${o.value}.request.url`);
			const pag = o.routing?.operations?.pagination?.properties;
			collect(pag?.continue, `${o.value}.pagination.continue`);
			collect(pag?.request?.qs?.cursor, `${o.value}.pagination.cursor`);
			for (const action of o.routing?.output?.postReceive ?? []) {
				collect(action.properties?.value, `${o.value}.postReceive.value`);
			}
		}
	}
	assert.ok(seen.length > 10, `expected to have checked many expressions, checked ${seen.length}`);
});

test('an optional parameter left blank is dropped from the request', () => {
	// Regression: an empty Fields went out as `extract_fields=` and the API
	// answered REQS004.
	const blankable = [];
	for (const p of walk(props)) {
		const value = p.routing?.send?.value;
		if (typeof value !== 'string' || !PURE.test(value)) continue;
		if (p.type !== 'string') continue;
		// A required field is always filled in, and its expression may legitimately
		// build an empty collection rather than drop the key.
		if (p.required) continue;
		blankable.push(p.name);
		assert.equal(
			compile(value)('', undefined, {}),
			undefined,
			`${p.name} sends a value when left blank`,
		);
	}
	assert.ok(blankable.includes('extractFields'), 'extractFields should be covered');
});

test('Stealth Mode sends nothing unless it is adaptive', () => {
	const mode = props.find((p) => p.name === 'mode');
	const run = compile(mode.routing.send.value);
	assert.equal(run('auto'), 'auto');
	assert.equal(run('manual'), undefined);
});

test('the Batch URL list becomes one task per line', () => {
	// Regression: TypeScript turned the `\n` into a real line break, so n8n
	// parsed an expression with a newline inside a string literal.
	const urls = props.find((p) => p.name === 'urls');
	const run = compile(urls.routing.send.value);
	assert.deepEqual(run('https://a.test\nhttps://b.test'), [
		{ url: 'https://a.test' },
		{ url: 'https://b.test' },
	]);
	assert.deepEqual(run('https://a.test\r\nhttps://b.test'), [
		{ url: 'https://a.test' },
		{ url: 'https://b.test' },
	]);
	assert.deepEqual(run('  https://a.test  \n\n\n'), [{ url: 'https://a.test' }]);
	assert.deepEqual(run(''), []);
});

test('deleting a batch job returns something, not a blank item', () => {
	// Regression: the API answers a delete with an empty body.
	const batch = operations.find((op) => op.options.some((o) => o.value === 'delete'));
	const del = batch.options.find((o) => o.value === 'delete');
	const set = del.routing.output.postReceive.find((a) => a.type === 'set');
	assert.ok(set, 'delete should set an explicit output');
	assert.deepEqual(compile(set.properties.value)(), { success: true });
});

test('reading a crawl never paginates while the crawl is still running', () => {
	// n8n's generic pagination has no request cap: a `continue` that stays true
	// loops forever. A running crawl's next_cursor is never null.
	const crawl = operations.find((op) => op.options.some((o) => o.value === 'getPageContent'));
	const results = crawl.options.find((o) => o.value === 'getResults');
	const run = compile(results.routing.operations.pagination.properties.continue);
	const body = (status, next_cursor) => ({ body: { status, next_cursor } });

	assert.equal(run(undefined, body('running', 'c1')), false, 'must not follow a running crawl');
	assert.equal(run(undefined, body('stopped', 'c1')), false, 'must not follow a draining crawl');
	assert.equal(run(undefined, body('completed', 'c1')), true);
	assert.equal(run(undefined, body('failed', 'c1')), true);
	assert.equal(run(undefined, body('completed', null)), false);
	assert.equal(run(undefined, body('completed', undefined)), false);
});

test('batch list pagination stops when the cursor runs out', () => {
	const batch = operations.find((op) => op.options.some((o) => o.value === 'delete'));
	const getAll = batch.options.find((o) => o.value === 'getAll');
	const run = compile(getAll.routing.operations.pagination.properties.continue);
	assert.equal(run(undefined, { body: { next_cursor: 'c1' } }), true);
	assert.equal(run(undefined, { body: { next_cursor: null } }), false);
	assert.equal(run(undefined, { body: {} }), false);
});

test('every operation declares a request', () => {
	for (const op of operations) {
		for (const o of op.options) {
			assert.ok(o.routing?.request?.method, `${o.value} has no method`);
			assert.ok(o.routing?.request?.url, `${o.value} has no url`);
			assert.ok(o.action, `${o.value} has no action label`);
		}
	}
});

test('the node ships no runtime dependencies', () => {
	const pkg = require('../package.json');
	assert.deepEqual(pkg.dependencies ?? {}, {});
	assert.equal(pkg.overrides, undefined, 'n8n rejects an overrides field');
	assert.ok(pkg.keywords.includes('n8n-community-node-package'));
	assert.equal(pkg.license, 'MIT');
});

test('the package name, the codex id and the n8n paths agree', () => {
	const pkg = require('../package.json');
	const codex = require('../dist/nodes/Zenrows/Zenrows.node.json');

	assert.match(
		pkg.name,
		/^(@[^/]+\/)?n8n-nodes-/,
		'n8n only discovers packages named n8n-nodes-* or @scope/n8n-nodes-*',
	);
	if (pkg.name.startsWith('@')) {
		assert.equal(
			pkg.publishConfig?.access,
			'public',
			'a scoped package publishes restricted by default, which hides it from everyone',
		);
	}
	assert.equal(
		codex.node,
		`${pkg.name}.${description.name}`,
		'the codex id is the package name plus the node name',
	);
	for (const entry of [...pkg.n8n.nodes, ...pkg.n8n.credentials]) {
		assert.ok(
			require('node:fs').existsSync(require('node:path').join(__dirname, '..', entry)),
			`package.json points at ${entry}, which the build does not produce`,
		);
	}
});
