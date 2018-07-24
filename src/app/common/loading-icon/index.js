import React from 'react';
import './style.less';
export default (props) => {
  let { className, ...rest } = props;
  return (
    <div className={'sk-fading-circle ' + (className || '')} {...rest}>
      <div className="sk-circle1 sk-circle"/>
      <div className="sk-circle2 sk-circle"/>
      <div className="sk-circle3 sk-circle"/>
      <div className="sk-circle4 sk-circle"/>
      <div className="sk-circle5 sk-circle"/>
      <div className="sk-circle6 sk-circle"/>
      <div className="sk-circle7 sk-circle"/>
      <div className="sk-circle8 sk-circle"/>
      <div className="sk-circle9 sk-circle"/>
      <div className="sk-circle10 sk-circle"/>
      <div className="sk-circle11 sk-circle"/>
      <div className="sk-circle12 sk-circle"/>
    </div>
  );
}