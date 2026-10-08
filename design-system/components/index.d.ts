// Documentation of the Essam bundle. Types are not checked against the script.

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps {
  /** primary: the one main action per view. secondary: a second action. Default primary. */
  variant?: ButtonVariant;
  /** Renders an <a> when set; otherwise a <button>. */
  href?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  /** Icon element shown after the label, sized 20px. */
  icon?: any;
  onClick?: (event: any) => void;
  className?: string;
  children?: any;
}

export interface CardProps {
  /** Heading shown at heading-3 size. */
  title?: string;
  className?: string;
  children?: any;
}

export interface TagProps {
  className?: string;
  children?: any;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  /** Wordmark text, used when no logo is given. */
  brand?: string;
  /** Image URL for the logo, shown instead of the brand text. */
  logo?: string;
  logoAlt?: string;
  /** Where the brand links to. Default "/". */
  homeHref?: string;
  links: NavLink[];
  className?: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectCardProps {
  title: string;
  description: string;
  /** Technology labels, shown uppercase. */
  tags?: string[];
  /** Image URL for the top of the card. Omit for a text-only card. */
  image?: string;
  imageAlt?: string;
  /** Opened in a new tab. */
  links?: ProjectLink[];
  className?: string;
}

export interface HeroAction {
  label: string;
  href: string;
  icon?: any;
}

export interface HeroProps {
  name: string;
  /** Shown on its own line in primary. */
  role?: string;
  lead?: string;
  keywords?: string[];
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  className?: string;
}

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormProps {
  /** Receives the values on submit. The form sends nothing itself. */
  onSubmit?: (values: ContactFormValues) => void;
  status?: "idle" | "loading" | "success" | "error";
  /** Text under the button. */
  statusMessage?: string;
  /** Prefix for input ids, when more than one form is on the page. */
  idPrefix?: string;
  className?: string;
}

export declare const Button: (props: ButtonProps) => any;
export declare const Card: (props: CardProps) => any;
export declare const Tag: (props: TagProps) => any;
export declare const Navbar: (props: NavbarProps) => any;
export declare const ProjectCard: (props: ProjectCardProps) => any;
export declare const Hero: (props: HeroProps) => any;
export declare const ContactForm: (props: ContactFormProps) => any;

export interface SectionProps {
  /** Anchor id, used by navbar links. */
  id?: string;
  /** Heading text. Omit for a section without a heading. */
  title?: string;
  className?: string;
  children?: any;
}

export interface SectionHeadingProps {
  title: string;
  className?: string;
}

export interface AboutProps {
  id?: string;
  /** Section heading. Default "About Me". */
  title?: string;
  lead: string;
  /** Shown after the lead in primary. */
  emphasis?: string;
  paragraphs?: string[];
  highlightsTitle?: string;
  highlights?: string[];
}

export interface ExperienceItem {
  title: string;
  company: string;
  companyUrl?: string;
  employmentType?: string;
  /** Pre-formatted text, such as "2 yrs 3 mos". */
  duration?: string;
  location?: string;
  points?: string[];
  skills?: string[];
}

export interface ExperienceProps {
  id?: string;
  title?: string;
  items: ExperienceItem[];
}

export interface SkillGroup {
  title: string;
  skills: string[];
}

export interface SkillsProps {
  id?: string;
  title?: string;
  groups: SkillGroup[];
}

export interface ProjectItem {
  title: string;
  description: string;
  tags?: string[];
  image?: string;
  imageAlt?: string;
  links?: ProjectLink[];
}

export interface ProjectsProps {
  id?: string;
  title?: string;
  items: ProjectItem[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqProps {
  id?: string;
  title?: string;
  items: FaqItem[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterContact {
  label: string;
  href: string;
  icon?: any;
  /** Opens in a new tab. */
  external?: boolean;
}

export interface FooterSocial {
  label: string;
  href: string;
  icon: any;
}

export interface FooterProps {
  logo?: string;
  logoAlt?: string;
  /** Wordmark text, used when no logo is given. */
  brand?: string;
  about?: string;
  links?: FooterLink[];
  contacts?: FooterContact[];
  socials?: FooterSocial[];
  linksHeading?: string;
  contactHeading?: string;
  copyright?: string;
  className?: string;
}

export declare const Section: (props: SectionProps) => any;
export declare const SectionHeading: (props: SectionHeadingProps) => any;
export declare const About: (props: AboutProps) => any;
export declare const Experience: (props: ExperienceProps) => any;
export declare const Skills: (props: SkillsProps) => any;
export declare const Projects: (props: ProjectsProps) => any;
export declare const Faq: (props: FaqProps) => any;
export declare const Footer: (props: FooterProps) => any;

// Built from the site source. Props are the same as the site's components (src/components/*.tsx).
// Loaded from components/lib/essam-site.js as the global EssamSite.
export declare const SiteHeader: () => any;
export declare const SiteHero: (props: { data: any | null }) => any;
export declare const SiteAbout: () => any;
export declare const SiteExperience: (props: { experiences: any[] }) => any;
export declare const SiteSkills: (props: { skills: any[] }) => any;
export declare const SiteProjects: (props: { projects: any[] }) => any;
export declare const SiteFaq: (props: { items: { question: string; answer: string }[] }) => any;
export declare const SiteFooter: (props: { data: any | null }) => any;
