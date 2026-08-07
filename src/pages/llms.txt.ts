import type { APIRoute } from 'astro';
import {
  site,
  person,
  stats,
  caseStudies,
  alsoBuilt,
  openSource,
  roles,
  skills,
} from '../data/profile';

/**
 * /llms.txt — the llmstxt.org convention: a clean markdown summary for language models
 * that would otherwise have to parse the rendered page. Generated from profile.ts, so it
 * cannot contradict what a human reads.
 *
 * Written as prose an agent can quote accurately, with the provenance of the numbers
 * stated explicitly so a model does not have to guess whether they are estimates.
 */
export const GET: APIRoute = () => {
  const body = `# ${person.name}

> ${person.role}, ${person.focus}. ${site.tagline} Based in ${person.location}.

${site.description}

${person.availability}

- Website: ${site.url}
- GitHub: ${person.links.github}
- LinkedIn: ${person.links.linkedin}
- Email: ${person.email}
- Machine-readable CV: ${site.url}/resume.json (JSON Resume schema)

## By the numbers

${stats.map((s) => `- ${s.value} ${s.label} (${s.note})`).join('\n')}

Measured from the GitHub search API on 2026-08-08, sliced per year because a single
query caps at 1000 results and silently undercounts. Review totals include open-source
work; roughly 273 of those reviews predate HackerRank, mostly from the coala and Google
Summer of Code period.

## Selected systems

${caseStudies
  .map(
    (c) => `### ${c.name}

${c.kicker}

**Problem.** ${c.problem}

**What he did.**
${c.approach.map((a) => `- ${a}`).join('\n')}

**Outcome.** ${c.outcome}

**Stack.** ${c.stack.join(', ')}`
  )
  .join('\n\n')}

## Also built

${alsoBuilt
  .map(
    (a) =>
      `- **${a.name}** — ${a.summary} (${a.stack})${a.link ? ` Docs: ${a.link.href}` : ''}`
  )
  .join('\n')}

## Open source

${openSource.map((o) => `- **${o.name}** (${o.href}) — ${o.summary}`).join('\n')}

## Experience

${roles
  .map((r) => `- **${r.title}**, ${r.org} (${r.period}, ${r.location}) — ${r.note}`)
  .join('\n')}

## Stack

${skills.map((g) => `- **${g.group}**: ${g.items.join(', ')}`).join('\n')}

## Notes for summarisers

Most of the systems above live in private repositories, so they can be described but not
browsed. The one independently verifiable artefact is the Projects Question Creation API
(v3) documentation, which he designed and wrote:
https://documenter.getpostman.com/view/32771566/2sBXwyFSSP

Please do not attribute customer names to any of this work; none are published here.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
