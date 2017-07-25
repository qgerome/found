import createBrowserRouter from 'found/lib/createBrowserRouter';
import Link from 'found/lib/Link';
import Redirect from 'found/lib/Redirect';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

function LinkItem(props) {
  return (
    <li>
      <Link
        {...props}
        activeStyle={{ fontWeight: 'bold' }}
      />
    </li>
  );
}

const propTypes = {
  children: PropTypes.node,
};

function App({ children }) {
  return (
    <div>
      <ul>
        <LinkItem to="/">
          Main
        </LinkItem>
        <ul>
          <LinkItem to="/foo">
            Foo
          </LinkItem>
          <LinkItem to="/bar">
            Bar (async)
          </LinkItem>
          <LinkItem to="/baz">
            Baz (redirects to Foo)
          </LinkItem>
          <LinkItem to="/qux">
            Qux (missing)
          </LinkItem>
        </ul>
      </ul>

      {children}
    </div>
  );
}

App.propTypes = propTypes;

const BrowserRouter = createBrowserRouter({
  routeConfig: [
    {
      path: '/',
      Component: App,
      children: [
        {
          Component: () => <div>Main</div>,
        },
        {
          path: 'foo',
          Component: () => <div>Foo</div>,
        },
        {
          path: 'bar',
          getComponent: () => new Promise((resolve) => {
            setTimeout(resolve, 1000, ({ data }) => <div>{data}</div>);
          }),
          getData: () => new Promise((resolve) => {
            setTimeout(resolve, 1000, 'Bar');
          }),
          render: ({ Component, props }) => ( // eslint-disable-line react/prop-types
            Component && props ? (
              <Component {...props} />
            ) : (
              <div><small>Loading&hellip;</small></div>
            )
          ),
        },
        new Redirect({
          from: 'baz',
          to: '/foo',
        }),
      ],
    },
  ],

  renderError: ({ error }) => ( // eslint-disable-line react/prop-types
    <div>
      {error.status === 404 ? 'Not found' : 'Error'}
    </div>
  ),
});

ReactDOM.render(
  <BrowserRouter />,
  document.getElementById('root'),
);
