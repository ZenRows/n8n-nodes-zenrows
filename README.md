# n8n-nodes-zenrows

An [n8n](https://n8n.io) community node for [Zenrows](https://www.zenrows.com), a web scraping API that gets past anti-bot systems, renders JavaScript and rotates proxies for you.

Without it, using Zenrows in n8n means an HTTP Request node and a hand-built URL. With it, you pick an operation, paste a URL, and your API key lives in n8n's credential store instead of in the workflow.

[Installation](#installation) · [Operations](#operations) · [Credentials](#credentials) · [Compatibility](#compatibility) · [Usage](#usage) · [Resources](#resources)

## Installation

Follow the [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) and enter `n8n-nodes-zenrows` as the package name.

On self-hosted n8n you can also install it from the command line:

```bash
npm install n8n-nodes-zenrows
```

## Operations

### Page

| Operation | What it does |
|---|---|
| **Scrape** | Fetches a page through Zenrows and returns its content under `data`. Markdown, plaintext, PDF and screenshots come back the same way. |
| **Extract Data** | Returns the page as named fields instead of markup, with no selectors to write. |

**Scrape** defaults to Adaptive stealth mode, which starts with the cheapest setup that could work and escalates only when the site pushes back. You are billed for the attempt that succeeds, not for the ones before it. Switch Stealth Mode to Manual when you want to set JS Rendering and Premium Proxy yourself.

### Crawl

Crawl walks a site from one URL and collects the URLs it finds, optionally with each page's content.

| Operation | What it does |
|---|---|
| **Create** | Starts a crawl from a URL and returns a `crawl_id`. |
| **Get** | Reads a crawl, its status and its coverage so far. |
| **Get Many** | Lists the crawls on the account, newest first. |
| **Get Results** | Lists the URLs the crawl kept, one item each. |
| **Get Page Content** | Returns one kept page under `data`, in the format it was crawled with. |
| **Stop** | Ends a running crawl, keeping what it found. |

Crawl has no fee of its own. Each page it opens is one Fetch request in Adaptive stealth mode, so 1 to 25 credits depending on the site, and **Max Pages** is what caps the bill.

**Get Results only pages through a crawl that has ended.** While a crawl is running its `next_cursor` is never null, so following it would never stop. Poll **Get** until `status` leaves `running`, then read the results.

### Batch Job

Batch runs the same work in the background, which is what you want for more URLs than a workflow should sit and wait for.

| Operation | What it does |
|---|---|
| **Create** | Queues a list of URLs, one per line, and returns a `job_id`. |
| **Get** | Reads a job and how far its current run has got, under `latest_run.stats`. |
| **Get Many** | Lists the jobs on the account. |
| **Get Results** | Lists a run's tasks with a download link for each one. |
| **Delete** | Removes a job and the results it still holds. |

A job is finished when `latest_run.stats.completed` reaches `latest_run.stats.total`. Each result link is presigned and valid for two hours, so fetch it promptly or list the run again.

## Credentials

You need a Zenrows API key. [Sign up for free](https://app.zenrows.com/register?p=free), then copy the key from the Integrate panel on any playground page at [app.zenrows.com](https://app.zenrows.com).

In n8n, create a **Zenrows API** credential and paste the key in. The node sends it as an `X-API-Key` header, so it never travels in a URL or shows up in an execution's query string.

The credential's Test button calls the account details endpoint, which costs no credits.

## Compatibility

Requires n8n 1.x and Node.js 20.19 or later. The node has no runtime dependencies.

## Usage

A first workflow, in four nodes:

1. **Manual Trigger**
2. **Zenrows** with Resource `Page`, Operation `Scrape`, URL `https://www.scrapingcourse.com/ecommerce/`
3. Add the option **Response Type** and set it to `Markdown`, so what comes out is readable instead of raw HTML
4. Anything that takes text: an AI node, a Google Sheets append, a Slack message

For a site that fills itself in after load, add **JS Rendering** and a **Wait For Selector** pointing at an element that only appears once the content is there.

### Credits

Zenrows bills in credits, and the cost depends on what the request needed:

| Request | Credits |
|---|---|
| Standard | 1 |
| JS rendering | 5 |
| Premium proxies | 10 |
| Both, on a protected site | 25 |

The free plan comes with 5,000 credits a month, always. See the [pricing page](https://docs.zenrows.com/first-steps/pricing) for the full table.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Zenrows documentation](https://docs.zenrows.com)
* [Fetch API reference](https://docs.zenrows.com/fetch/api-reference)
* [Extract](https://docs.zenrows.com/extract/setup)
* [Crawl endpoints](https://docs.zenrows.com/crawl/endpoints)
* [Batch REST API](https://docs.zenrows.com/batch/developer-guide-restapi)
* [API error codes](https://docs.zenrows.com/api-error-codes)

## Version history

| Version | Changes |
|---|---|
| 0.1.0 | First release. Page (Scrape, Extract Data), Crawl (Create, Get, Get Many, Get Results, Get Page Content, Stop) and Batch Job (Create, Get, Get Many, Get Results, Delete). |

## License

[MIT](LICENSE)
