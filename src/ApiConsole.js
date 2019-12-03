import { LitElement, html, css } from 'lit-element';
import '@anypoint-web-components/api-console/api-console-app.js';
import '@anypoint-web-components/anypoint-styles/colors.js';

export class ApiConsoleContainer extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
        }

        api-console-app {
          overflow: auto;
        }
      `,
    ];
  }

  render() {
    return html`<api-console-app
      redirecturi="https://auth.advancedrestclient.com/oauth-popup.html"
      rearrangeEndpoints
      modelLocation="/api-model.json"
    ></api-console-app>`;
  }
}
