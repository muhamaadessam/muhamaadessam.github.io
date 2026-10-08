/* @ds-bundle: {"format":4,"namespace":"Essam","components":[{"name":"Button"},{"name":"Card"},{"name":"Tag"},{"name":"Navbar"},{"name":"ProjectCard"},{"name":"Hero"},{"name":"ContactForm"},{"name":"Section"},{"name":"SectionHeading"},{"name":"About"},{"name":"Experience"},{"name":"Skills"},{"name":"Projects"},{"name":"Faq"},{"name":"Footer"}]} */
(function (global) {
  var React = global.React;
  var h = React.createElement;

  function cx() {
    return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
  }

  // Primary and secondary call-to-action. Renders <a> when href is set, otherwise <button>.
  function Button(props) {
    var variant = props.variant || 'primary';
    var className = cx('ess-btn', 'ess-btn--' + variant, props.className);
    var icon = props.icon ? h('span', { className: 'ess-btn__icon' }, props.icon) : null;
    if (props.href) {
      return h('a', { className: className, href: props.href, target: props.target, rel: props.rel, onClick: props.onClick }, props.children, icon);
    }
    return h('button', { className: className, type: props.type || 'button', disabled: props.disabled, onClick: props.onClick }, props.children, icon);
  }

  // Translucent glass panel. Optional title renders as the card heading.
  function Card(props) {
    var title = props.title ? h('h3', { className: 'ess-card__title' }, props.title) : null;
    return h('div', { className: cx('ess-card', props.className) }, title, props.children);
  }

  // Small pill for a skill, technology or keyword. Not interactive.
  function Tag(props) {
    return h('span', { className: cx('ess-tag', props.className) }, props.children);
  }

  // Floating header: brand on the left, links on the right, and a menu button under md.
  // links: [{ label, href }]. Pass logo (an image URL) to show it instead of the brand text.
  function Navbar(props) {
    var links = props.links || [];
    var openState = React.useState(false);
    var open = openState[0];
    var setOpen = openState[1];

    function linkItems() {
      return links.map(function (link, index) {
        return h('a', { key: index, href: link.href, className: 'ess-nav__link', onClick: function () { setOpen(false); } }, link.label);
      });
    }

    var brand = props.logo
      ? h('img', { className: 'ess-nav__logo', src: props.logo, alt: props.logoAlt || '' })
      : h('span', { className: 'ess-nav__wordmark' }, props.brand);

    var menuIcon = open
      ? h('svg', { viewBox: '0 0 24 24', width: 24, height: 24, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', 'aria-hidden': 'true' }, h('path', { d: 'M6 6l12 12M18 6L6 18' }))
      : h('svg', { viewBox: '0 0 24 24', width: 24, height: 24, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', 'aria-hidden': 'true' }, h('path', { d: 'M4 6h16M4 12h16M4 18h16' }));

    return h('header', { className: cx('ess-nav', props.className) },
      h('div', { className: 'ess-nav__bar' },
        h('a', { className: 'ess-nav__brand', href: props.homeHref || '/' }, brand),
        h('nav', { className: 'ess-nav__links', 'aria-label': 'Primary' }, linkItems()),
        h('button', {
          type: 'button',
          className: 'ess-nav__toggle',
          'aria-label': open ? 'Close menu' : 'Open menu',
          'aria-expanded': open,
          onClick: function () { setOpen(!open); }
        }, menuIcon)
      ),
      open ? h('nav', { className: 'ess-nav__menu', 'aria-label': 'Mobile' }, linkItems()) : null
    );
  }

  // Project tile: image (optional), title, technology tags, description and links.
  // tags: string[]. links: [{ label, href }], opened in a new tab.
  function ProjectCard(props) {
    var media = props.image
      ? h('div', { className: 'ess-project__media' }, h('img', { src: props.image, alt: props.imageAlt || '', loading: 'lazy' }))
      : null;
    var tags = (props.tags || []).map(function (tag, index) {
      return h('span', { key: index, className: 'ess-project__tag' }, tag);
    });
    var links = (props.links || []).map(function (link, index) {
      return h('a', { key: index, className: 'ess-project__link', href: link.href, target: '_blank', rel: 'noreferrer' }, link.label);
    });
    return h('article', { className: cx('ess-project', props.className) },
      media,
      h('div', { className: 'ess-project__body' },
        h('h3', { className: 'ess-project__title' }, props.title),
        h('div', { className: 'ess-project__tags' }, tags),
        h('p', { className: 'ess-project__desc' }, props.description),
        h('div', { className: 'ess-project__links' }, links)
      )
    );
  }

  // Landing block: name, role on its own line, a lead paragraph, keyword tags and up to two actions.
  // keywords: string[]. primaryAction and secondaryAction: { label, href, icon? }.
  function Hero(props) {
    var keywords = (props.keywords || []).map(function (keyword, index) {
      return h(Tag, { key: index }, keyword);
    });
    var primary = props.primaryAction
      ? h(Button, { variant: 'primary', href: props.primaryAction.href }, props.primaryAction.label)
      : null;
    var secondary = props.secondaryAction
      ? h(Button, { variant: 'secondary', href: props.secondaryAction.href, target: '_blank', rel: 'noreferrer', icon: props.secondaryAction.icon }, props.secondaryAction.label)
      : null;
    return h('section', { className: cx('ess-hero', props.className) },
      h('h1', { className: 'ess-hero__name' },
        props.name,
        props.role ? h('span', { className: 'ess-hero__role' }, props.role) : null
      ),
      props.lead ? h('p', { className: 'ess-hero__lead' }, props.lead) : null,
      h('div', { className: 'ess-hero__keywords' }, keywords),
      h('div', { className: 'ess-hero__actions' }, primary, secondary)
    );
  }

  // Name, email and message form. Calls onSubmit({ name, email, message }).
  // status: 'idle' | 'loading' | 'success' | 'error'. statusMessage is shown under the button.
  function ContactForm(props) {
    var valuesState = React.useState({ name: '', email: '', message: '' });
    var values = valuesState[0];
    var setValues = valuesState[1];
    var status = props.status || 'idle';
    var busy = status === 'loading';
    var idPrefix = props.idPrefix || 'ess';

    function update(key) {
      return function (event) {
        var value = event.target.value;
        setValues(function (prev) {
          var next = Object.assign({}, prev);
          next[key] = value;
          return next;
        });
      };
    }

    function submit(event) {
      event.preventDefault();
      if (props.onSubmit) props.onSubmit(values);
    }

    var buttonLabel = status === 'success' ? 'Message Sent' : busy ? 'Sending…' : 'Send Message';

    return h('form', { className: cx('ess-form', props.className), onSubmit: submit },
      h('div', { className: 'ess-form__row' },
        h('div', { className: 'ess-form__field' },
          h('label', { className: 'ess-form__label', htmlFor: idPrefix + '-name' }, 'Name'),
          h('input', { className: 'ess-form__input', id: idPrefix + '-name', name: 'name', type: 'text', required: true, placeholder: 'John Doe', value: values.name, onChange: update('name'), disabled: busy })
        ),
        h('div', { className: 'ess-form__field' },
          h('label', { className: 'ess-form__label', htmlFor: idPrefix + '-email' }, 'Email'),
          h('input', { className: 'ess-form__input', id: idPrefix + '-email', name: 'email', type: 'email', required: true, placeholder: 'john@example.com', value: values.email, onChange: update('email'), disabled: busy })
        )
      ),
      h('div', { className: 'ess-form__field' },
        h('label', { className: 'ess-form__label', htmlFor: idPrefix + '-message' }, 'Message'),
        h('textarea', { className: 'ess-form__input ess-form__textarea', id: idPrefix + '-message', name: 'message', required: true, rows: 5, placeholder: 'Your message here...', value: values.message, onChange: update('message'), disabled: busy })
      ),
      h(Button, { variant: 'primary', type: 'submit', disabled: busy, className: 'ess-form__submit' }, buttonLabel),
      h('p', { className: cx('ess-form__status', status === 'success' && 'ess-form__status--success', status === 'error' && 'ess-form__status--error'), role: 'status', 'aria-live': 'polite' }, props.statusMessage || '')
    );
  }

  // Section title with the short primary bar under it.
  function SectionHeading(props) {
    return h('div', { className: cx('ess-section__heading', props.className) },
      h('h2', { className: 'ess-section__title' }, props.title),
      h('div', { className: 'ess-section__bar' })
    );
  }

  // Page section: optional heading, then its children inside a centred container.
  // id is the anchor used by the navbar links.
  function Section(props) {
    var heading = props.title ? h(SectionHeading, { title: props.title }) : null;
    return h('section', { id: props.id, className: cx('ess-section', props.className) },
      h('div', { className: 'ess-section__inner' }, heading, props.children)
    );
  }

  // Intro panel. title: section heading. lead + emphasis: the big line, where emphasis is shown in primary.
  // paragraphs: string[]. highlightsTitle + highlights: string[] for the checklist under the text.
  function About(props) {
    var paragraphs = (props.paragraphs || []).map(function (text, index) {
      return h('p', { key: index }, text);
    });
    var highlights = (props.highlights || []).map(function (text, index) {
      return h('li', { key: index, className: 'ess-about__item' }, h('span', { className: 'ess-about__check', 'aria-hidden': 'true' }, '✓'), text);
    });
    return h(Section, { id: props.id || 'about', title: props.title || 'About Me' },
      h('div', { className: 'ess-card ess-about' },
        h('h3', { className: 'ess-about__lead' },
          props.lead,
          props.emphasis ? h('span', { className: 'ess-about__emphasis' }, props.emphasis) : null
        ),
        h('div', { className: 'ess-about__body' }, paragraphs),
        props.highlightsTitle ? h('h4', { className: 'ess-about__heading' }, props.highlightsTitle) : null,
        h('ul', { className: 'ess-about__list' }, highlights)
      )
    );
  }

  // Work history. items: [{ title, company, companyUrl?, employmentType?, duration?, location?, points?: string[], skills?: string[] }].
  function Experience(props) {
    var items = (props.items || []).map(function (item, index) {
      var company = item.companyUrl
        ? h('a', { className: 'ess-exp__company', href: item.companyUrl, target: '_blank', rel: 'noopener noreferrer' }, item.company)
        : h('span', { className: 'ess-exp__company' }, item.company);
      var points = (item.points || []).map(function (point, pointIndex) {
        return h('li', { key: pointIndex, className: 'ess-exp__point' },
          h('span', { className: 'ess-exp__marker', 'aria-hidden': 'true' }, '▸'),
          h('span', null, point)
        );
      });
      var skills = (item.skills || []).map(function (skill, index) {
        return h('span', { key: index, className: 'ess-exp__skill' }, skill);
      });
      var meta = [item.duration, item.location].filter(Boolean).join(' • ');
      return h('li', { key: index, className: 'ess-card ess-exp' },
        h('h3', { className: 'ess-exp__title' }, item.title),
        h('div', { className: 'ess-exp__company-row' },
          company,
          item.employmentType ? h('span', { className: 'ess-exp__type' }, '• ' + item.employmentType) : null
        ),
        meta ? h('div', { className: 'ess-exp__meta' }, meta) : null,
        h('ul', { className: 'ess-exp__points' }, points),
        skills.length ? h('div', { className: 'ess-exp__skills' }, skills) : null
      );
    });
    return h(Section, { id: props.id || 'experience', title: props.title || 'Experience' },
      h('ol', { className: 'ess-exp__list' }, items)
    );
  }

  // Skill groups. groups: [{ title, skills: string[] }].
  function Skills(props) {
    var groups = (props.groups || []).map(function (group, index) {
      var chips = (group.skills || []).map(function (skill, index) {
        return h('span', { key: index, className: 'ess-skills__chip' }, skill);
      });
      return h('div', { key: index, className: 'ess-card ess-skills__group' },
        h('h3', { className: 'ess-skills__title' }, group.title),
        h('div', { className: 'ess-skills__chips' }, chips)
      );
    });
    return h(Section, { id: props.id || 'skills', title: props.title || 'My Skills' },
      h('div', { className: 'ess-skills__grid' }, groups)
    );
  }

  // Project grid. items: [{ title, description, tags?, image?, imageAlt?, links? }], each rendered as ProjectCard.
  function Projects(props) {
    var cards = (props.items || []).map(function (item, index) {
      return h(ProjectCard, {
        key: item.title + index,
        title: item.title,
        description: item.description,
        tags: item.tags,
        image: item.image,
        imageAlt: item.imageAlt,
        links: item.links
      });
    });
    return h(Section, { id: props.id || 'projects', title: props.title || 'Projects' },
      h('div', { className: 'ess-projects__grid' }, cards)
    );
  }

  // Questions and answers. items: [{ question, answer }].
  function Faq(props) {
    var items = (props.items || []).map(function (item, index) {
      return h('div', { key: index, className: 'ess-card ess-faq__item' },
        h('dt', { className: 'ess-faq__question' }, item.question),
        h('dd', { className: 'ess-faq__answer' }, item.answer)
      );
    });
    return h(Section, { id: props.id || 'faq', title: props.title || 'Frequently Asked Questions' },
      h('dl', { className: 'ess-faq__list' }, items)
    );
  }

  // Site footer. Pass logo or brand, a short about line, and three lists:
  // links: [{ label, href }], contacts: [{ label, href, icon?, external? }], socials: [{ label, href, icon }].
  function Footer(props) {
    var logo = props.logo
      ? h('img', { className: 'ess-footer__logo', src: props.logo, alt: props.logoAlt || '' })
      : h('span', { className: 'ess-footer__wordmark' }, props.brand);
    var links = (props.links || []).map(function (link, index) {
      return h('li', { key: index }, h('a', { className: 'ess-footer__link', href: link.href }, link.label));
    });
    var contacts = (props.contacts || []).map(function (contact, index) {
      return h('li', { key: index },
        h('a', {
          className: 'ess-footer__contact',
          href: contact.href,
          target: contact.external ? '_blank' : undefined,
          rel: contact.external ? 'noreferrer' : undefined
        },
          contact.icon ? h('span', { className: 'ess-footer__icon', 'aria-hidden': 'true' }, contact.icon) : null,
          contact.label
        )
      );
    });
    var socials = (props.socials || []).map(function (social, index) {
      return h('a', { key: index, className: 'ess-footer__social', href: social.href, target: '_blank', rel: 'noreferrer', 'aria-label': social.label }, social.icon);
    });
    return h('footer', { className: cx('ess-footer', props.className) },
      h('div', { className: 'ess-footer__grid' },
        h('div', { className: 'ess-footer__col' }, logo, h('p', { className: 'ess-footer__about' }, props.about)),
        h('div', { className: 'ess-footer__col' },
          h('h3', { className: 'ess-footer__heading' }, props.linksHeading || 'Quick Links'),
          h('ul', { className: 'ess-footer__list' }, links)
        ),
        h('div', { className: 'ess-footer__col' },
          h('h3', { className: 'ess-footer__heading' }, props.contactHeading || 'Contact'),
          h('ul', { className: 'ess-footer__list' }, contacts)
        )
      ),
      h('div', { className: 'ess-footer__bottom' },
        h('p', { className: 'ess-footer__copy' }, props.copyright),
        h('div', { className: 'ess-footer__socials' }, socials)
      )
    );
  }

  global.Essam = {
    Button: Button,
    Card: Card,
    Tag: Tag,
    Navbar: Navbar,
    ProjectCard: ProjectCard,
    Hero: Hero,
    ContactForm: ContactForm,
    Section: Section,
    SectionHeading: SectionHeading,
    About: About,
    Experience: Experience,
    Skills: Skills,
    Projects: Projects,
    Faq: Faq,
    Footer: Footer
  };
})(window);
