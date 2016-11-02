import React from 'react';

// Library for making asychronous HTTP requests, more here:
// https://github.com/visionmedia/superagent
import superagent from 'superagent';

export default class SampleApplication extends React.Component {
  constructor(props) {
    super(props);
    // This initializes the state of the component.  Further updates should be done via calls
    // to setState, which updates the state and triggers React's diff based mechanism for
    // determining if the resulting HTML should be updated, see React's documentation
    // for more info: https://facebook.github.io/react/docs/component-api.html
    this.state = { text: 'Loading /api/hello' };
  }
  // This runs after the component is "mounted", meaning just after it's been rendered into the
  // DOM.  At this point it's safe to interact with the DOM, or kick off other actions (like
  // making an async request).  See https://facebook.github.io/react/docs/component-specs.html
  // for more information on the lifecycle of components.
  componentDidMount() {
    superagent.get('/api/hello').end((err, response) => {
        if (!err) {
          this.setState({ text: `Response received: ${response.text}`});
        } else {
          this.setState({ text: `Oh No! Something went wrong: ${err}`});
        }
    });
  }
  render() {
    return (
      <div>
        <header className="padded" ref="header"><h1>Sample Application</h1></header>
        <main className="text-center padded">
          <section>
            <h2>Nice!</h2>
            <img src="/assets/images/robot.svg" width="400" height="400" />
            <pre>{this.state.text}</pre>
          </section>
        </main>
      </div>
    );
  }
}
