module.exports = {
  title: 'BeanIO v3',
  tagline: 'A Java library for marshalling and unmarshalling bean objects.',
  url: 'https://beanio.github.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'beanio', // Usually your GitHub org/user name.
  projectName: 'beanio', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'BeanIO v3',
      // logo: {
      //   alt: 'BeanIO Logo',
      //   src: 'img/logo.svg',
      // },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        // {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/beanio/beanio',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Reference Guide',
              to: 'docs/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/bean-io',
            },
            {
              label: 'Google Groups',
              href: 'https://groups.google.com/g/beanio',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/beanio/beanio',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} BeanIO. Icons made by <a href="https://www.flaticon.com/authors/iconixar" title="iconixar">iconixar</a> from <a href="https://www.flaticon.com/" title="Flaticon">flaticon.com</a>`,
    },
    prism: {
      additionalLanguages: ['java'],
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/beanio/beanio.github.com/edit/master/docs/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/beanio/beanio.github.com/edit/master/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
