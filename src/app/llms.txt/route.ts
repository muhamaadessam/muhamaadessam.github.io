import { getExperiences, getPortfolioData, getProjects, getSkills } from '@/lib/services';
import { DEFAULT_DESCRIPTION, PERSON_NAME, SITE_URL, projectUrl } from '@/lib/seo';

export const dynamic = 'force-static';
export const revalidate = 86400;

// llms.txt: a plain-Markdown summary of the site for AI assistants and answer engines.
export async function GET() {
  const [portfolio, projects, experiences, skills] = await Promise.all([
    getPortfolioData(),
    getProjects(),
    getExperiences(),
    getSkills(),
  ]);

  const name = portfolio?.name || PERSON_NAME;
  const lines: string[] = [
    `# ${name}`,
    '',
    `> ${DEFAULT_DESCRIPTION}`,
    '',
    `${name} is a ${portfolio?.jop_title?.trim() || 'Flutter Developer'}. This site is the personal portfolio: about, projects, experience, skills, and contact.`,
    '',
    '## Pages',
    '',
    `- [Home](${SITE_URL}/): About, projects, experience, skills, FAQ, and contact`,
  ];

  if (projects.length > 0) {
    lines.push('', '## Projects', '');
    for (const project of projects) {
      lines.push(`- [${project.projectName}](${projectUrl(project.id)}): ${project.projectDescription}`);
    }
  }

  if (experiences.length > 0) {
    lines.push('', '## Experience', '');
    for (const exp of experiences) {
      const period = `${exp.startDate} to ${exp.endDate || 'Present'}`;
      lines.push(`- ${exp.title}, ${exp.company}${exp.location ? ` (${exp.location})` : ''}, ${period}`);
    }
  }

  if (skills.length > 0) {
    lines.push('', '## Skills', '');
    for (const group of skills) {
      lines.push(`- ${group.title}: ${group.skills.join(', ')}`);
    }
  }

  lines.push(
    '',
    '## Links',
    '',
    `- [LinkedIn](${portfolio?.linkedin || 'https://www.linkedin.com/in/muhammadessam159/'})`,
    `- [GitHub](${portfolio?.github || 'https://github.com/muhamaadessam'})`,
    '',
  );

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
