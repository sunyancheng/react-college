/**
 * This module is responsible for generating the HTML page response for
 * the react application middleware.
 */

/* eslint-disable react/no-danger */
/* eslint-disable react/no-array-index-key */

import React, { Children } from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript'
import fs from 'fs';
import path from 'path';
import Html from './HTML';

const appRootDir = require('app-root-dir').get();


// function stylesheetTag(stylesheetFilePath) {
//   return (
//     <link href={stylesheetFilePath} media="screen, projection" rel="stylesheet" type="text/css" />
//   );
// }

function scriptTag(jsFilePath) {
  return <script type="text/javascript" src={jsFilePath} />;
}

function handleRedux(store, nonce) {
  return <script nonce={nonce} type="text/javascript" dangerouslySetInnerHTML={{ __html: `window.__INITIAL_STATE__=${serialize(store.getState())}` }} />
}

// COMPONENT

function ServerHTML(props) {
  const { nonce, helmet, reactAppString, store, name, asyncBundles } = props;

  // Creates an inline script definition that is protected by the nonce.
  // const inlineScript = body =>
  //   <script nonce={nonce} type="text/javascript" dangerouslySetInnerHTML={{ __html: body }} />;


  const headerElements = !helmet ? [] : Children.toArray([
    helmet.meta.toComponent(),
    helmet.title.toComponent(),
    helmet.base.toComponent(),
    helmet.link.toComponent(),
    helmet.style.toComponent()
  ]).filter(i => !!i);


  const assets = JSON.parse(fs.readFileSync(path.join(appRootDir, 'public/client/assets.json')));
  const assetNames = [`/vendor/vendor.dll.js`].concat(asyncBundles).concat(['manifest', 'common', name].map(chunkName => assets[chunkName].js));
  const bodyElements = Children.toArray(assetNames.map(scriptTag));

  const reduxElement = Children.toArray([
    handleRedux(store, nonce)
  ])

  return (
    <Html
      htmlAttributes={helmet && helmet.htmlAttributes.toComponent()}
      headerElements={headerElements}
      bodyElements={bodyElements}
      appBodyString={reactAppString}
      reduxString={reduxElement}
    />
  );
}

ServerHTML.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  asyncComponentsState: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  helmet: PropTypes.object,
  nonce: PropTypes.string,
  reactAppString: PropTypes.string,
};

export default ServerHTML;
