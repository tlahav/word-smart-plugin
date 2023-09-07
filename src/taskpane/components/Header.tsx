import * as React from "react";

export interface HeaderProps {
  title: string;
  logo: string;
  message: string;
}

export default class Header extends React.Component<HeaderProps> {
  render() {
    const { title, logo, message } = this.props;

    return (
      <section className="ms-welcome__header ms-bgColor-neutralLighter ms-u-fadeIn500">
        <img width="40" height="40" src={logo} alt={title} title={title} />
        <span className="ms-fontSize-su ms-fontWeight-light ms-fontColor-neutralPrimary">{message}</span>
      </section>
    );
  }
}
