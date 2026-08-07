import type { APIRoute } from 'astro';
import {
  site,
  person,
  roles,
  skills,
  caseStudies,
  alsoBuilt,
  openSource,
  education,
} from '../data/profile';

/**
 * JSON Resume (https://jsonresume.org/schema/) so any tool can ingest the history
 * programmatically instead of scraping the page. Built from the same profile.ts the
 * human page renders from.
 */
export const GET: APIRoute = () => {
  const resume = {
    $schema:
      'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics: {
      name: person.name,
      label: `${person.role} — ${person.focus}`,
      email: person.email,
      summary: site.description,
      url: site.url,
      location: { city: 'Bengaluru', countryCode: 'IN' },
      profiles: [
        { network: 'GitHub', username: 'sangamcse', url: person.links.github },
        { network: 'LinkedIn', username: 'sangamcse', url: person.links.linkedin },
      ],
    },
    work: roles.map((role) => ({
      name: role.org,
      position: role.title,
      location: role.location,
      startDate: role.period.split('—')[0].trim(),
      endDate: role.period.split('—')[1].trim(),
      summary: role.note,
    })),
    education: [
      {
        institution: education.institution,
        area: 'Computer Science and Engineering',
        studyType: 'B.Tech',
        startDate: '2015-08',
        endDate: '2019-05',
      },
    ],
    skills: skills.map((group) => ({
      name: group.group,
      keywords: [...group.items],
    })),
    projects: [
      ...caseStudies.map((c) => ({
        name: c.name,
        description: `${c.kicker} ${c.problem}`,
        highlights: [...c.approach, c.outcome],
        keywords: [...c.stack],
        url: `${site.url}/#${c.id}`,
      })),
      ...alsoBuilt.map((a) => ({
        name: a.name,
        description: a.summary,
        keywords: a.stack.split(' · '),
        ...(a.link ? { url: a.link.href } : {}),
      })),
      ...openSource.map((o) => ({
        name: `${o.name} (open source)`,
        description: o.summary,
        url: o.href,
      })),
    ],
    meta: {
      canonical: `${site.url}/resume.json`,
      version: 'v1.0.0',
      note:
        'Review and PR counts on the site are measured from the GitHub search API, ' +
        'sliced per year because a single query caps at 1000 results.',
    },
  };

  return new Response(JSON.stringify(resume, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
