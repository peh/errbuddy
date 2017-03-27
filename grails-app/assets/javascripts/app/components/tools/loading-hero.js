import React from "react";
import Hero from "./hero";

export default class LoadingHero extends React.Component {

  render() {
    return (
      <Hero><h1>Loading <i className="fa fa-spin fa-spinner"></i></h1></Hero>
    )
  }

}
