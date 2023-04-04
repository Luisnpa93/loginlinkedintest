import handlebars from 'handlebars';
import { User } from '../entities/user.entity';
import { NewsletterConfig } from '../types';

export class NewsletterService {
  async generateNewsletter(user: User, config: NewsletterConfig): Promise<string> {
    // Load the Handlebars template
    const template = handlebars.compile(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>{{ title }}</title>
          <style>
            /* Define your CSS styles here */
          </style>
        </head>
        <body>
          <header>
            <h1>{{ title }}</h1>
          </header>

          <main>
            {{#if user.name }}
              <p>Hello {{ user.name }},</p>
            {{ else }}
              <p>Hello there,</p>
            {{/if}}

            {{#if articles.length }}
              <h2>Articles you may be interested in:</h2>

              <ul>
                {{#each articles}}
                  <li>
                    <h3>{{ title }}</h3>
                    <p>{{ summary }}</p>
                    <p><a href="{{ url }}">Read more</a></p>
                  </li>
                {{/each}}
              </ul>
            {{ else }}
              <p>Sorry, there are no articles to show you today.</p>
            {{/if}}

            {{#if events.length }}
              <h2>Events happening in your area:</h2>

              <ul>
                {{#each events}}
                  <li>
                    <h3>{{ title }}</h3>
                    <p>{{ summary }}</p>
                    <p><a href="{{ url }}">Learn more</a></p>
                  </li>
                {{/each}}
              </ul>
            {{ else }}
              <p>Sorry, there are no events to show you today.</p>
            {{/if}}
          </main>

          <footer>
            <p>If you have any feedback or suggestions, please reply to this email and let us know.</p>
            <p>Thank you for reading!</p>
          </footer>
        </body>
      </html>
    `);

    // Generate the newsletter content based on the user characteristics and configuration
    const newsletterContent = template({
      title: config.title,
      user: {
        name: user.username,
      },
      articles: config.articles,
      events: config.events,
    });

    return newsletterContent;
  }

  async getCustomNewsletterConfig(config?: NewsletterConfig): Promise<NewsletterConfig> {
    return {
      title: config.title ?? 'Acme Newsletter',
      articles: config.articles ?? [
        { title: 'Article 1', summary: 'This is a summary of article 1', url: 'https://example.com/article1' },
        { title: 'Article 2', summary: 'This is a summary of article 2', url: 'https://example.com/article2' },
      ],
      events: config.events ?? [
        { title: 'Event 1', summary: 'This is a summary of event 1', url: 'https://example.com/event1' },
        { title: 'Event 2', summary: 'This is a summary of event 2', url: 'https://example.com/event2' },
      ],
    };
  }
  
  
  
}
