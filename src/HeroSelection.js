import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './css/App.css';
import './css/HeroSelection.css';

import yaga from './images/heroes/yaga.jpg';
import morevna from './images/heroes/morevna.jpg';

const images = {
    yaga,
    morevna,
};

function isAvailable(app, hero) {
    return app.profile.characters.find((char) => {
        console.log(char, hero.id);
        return char === hero.id;
    });
}

// Pop-up with character details
const HeroDetails = props => (
    <div className="hero-info">
        <button className="btn-close" type="button" onClick={() => props.closeDetails()}>
            X
        </button>
        {/* <img src={images[props.hero.id]} alt={props.hero.id}/> */}
        <h3 className="hero-name">
            {props.hero.name}
        </h3>
        <p className="hero-description">
            {props.hero.description}
        </p>
    </div>
);

// Individual hero block, repeates to display every character
const HeroBlock = props => (
    <div className={isAvailable(props.app, props.hero) ? 'hero-block' : 'hero-block hero-inactive'}>
        <button className="btn-character" type="button" onClick={() => (isAvailable(props.app, props.hero) ? props.onShow(props.hero) : props.showDetails(props.hero))}>
            <img className="hero-image" src={images[props.hero.id]} alt={props.hero.id} />
        </button>
        <button className="btn-character-info" type="button" hero={props.hero} onClick={() => props.showDetails(props.hero)}>
            Info
        </button>
    </div>
);

// List of all characters, for each the HeroBlock is displayed.
// Click will take the player into character info screen
const ListOfHeroes = props => (
    <div className="heroselection-container">
        <div className="heroselection-header">
            <div className="heroselection-header-menu heroselection-title">
                <span>
                    Select character
                </span>
            </div>
            <div className="heroselection-header-menu heroselection-nav-menu">
                <button type="button" className="btn-nav-menu">
                    <span className="btn-hero btn-hero-left" />
                </button>
                <span>
                    nav menu
                </span>
                <button type="button" className="btn-nav-menu">
                    <span className="btn-hero btn-hero-right" />
                </button>
            </div>
            <div className="heroselection-header-menu heroselection-char-details">
                <span>
                    character details
                </span>
            </div>
        </div>
        <div className="heroselection-main">
            {Object.values(props.app.heroSelect).map(hero => (
                <HeroBlock
                    key={hero.id}
                    onShow={props.onShow}
                    showDetails={props.showDetails}
                    hero={hero}
                    app={props.app}
                />
            ))}
        </div>
        <div className="heroselection-footer">
            <div className="heroselection-footer-menu heroselection-play">
                <button type="button" className="btn-play">
                    <span>
                        PLAY
                    </span>
                </button>
            </div>
            <div className="heroselection-footer-menu selection-btn-start-screen">
                <button type="button" className="btn-start-screen" onClick={() => props.onPrevious()}>
                    TO START SCREEN
                </button>
            </div>
        </div>
    </div>
);

// Info about one hero. The click on the image should show a popup with char details
const OneHero = props => (
    <div className="hero-details">
        <h3 className="hero-details-title">
            {props.hero.name}
        </h3>
        <img src={images[props.hero.id]} alt={props.hero.id} />
        <div className="hero-details-btn-block">
            <button type="button" onClick={() => props.onBack()}>
                Back
            </button>
            <button type="button" onClick={() => props.onSelect(props.hero)}>
                Select
            </button>
        </div>
    </div>
);

class HeroSelection extends Component {
    constructor(props) {
        super(props);
        this.state = { hero: null, details: null };
        this.showHero = this.showHero.bind(this);
        this.selectHero = this.selectHero.bind(this);
        this.showDetails = this.showDetails.bind(this);
        this.closeDetails = this.closeDetails.bind(this);
        this.goStartScreen = this.goStartScreen.bind(this);
    }

    showHero(hero) {
        this.setState({ hero });
    }

    selectHero(hero) {
        this.props.sendMessage({ type: 'HEROSELECTED', hero: hero.id });
    }

    showDetails(hero) {
        this.setState({ details: hero });
    }

    closeDetails() {
        this.setState({ details: null });
    }

    goStartScreen() {
        this.props.sendMessage({ type: 'STARTSCREEN' });
    }

    render() {
        return (
            <div>
                {this.state.hero
                    ? (
                        <OneHero
                            hero={this.state.hero}
                            onBack={this.showHero}
                            onSelect={this.selectHero}
                        />
                    )
                    : (
                        <ListOfHeroes
                            app={this.props.app}
                            onShow={this.showHero}
                            showDetails={this.showDetails}
                            onPrevious={this.goStartScreen}

                        />
                    )}
                {this.state.details
                    ? <HeroDetails hero={this.state.details} closeDetails={this.closeDetails} />
                    : null}
            </div>
        );
    }
}

HeroDetails.propTypes = {
    hero: PropTypes.object.isRequired,
    closeDetails: PropTypes.func.isRequired,
};

HeroBlock.propTypes = {
    app: PropTypes.object.isRequired,
    hero: PropTypes.object.isRequired,
    onShow: PropTypes.func.isRequired,
    showDetails: PropTypes.func.isRequired,
};

ListOfHeroes.propTypes = {
    app: PropTypes.object.isRequired,
    onShow: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
    showDetails: PropTypes.func.isRequired,
};

OneHero.propTypes = {
    hero: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
};

HeroSelection.propTypes = {
    sendMessage: PropTypes.func.isRequired,
    app: PropTypes.object.isRequired,
};


export default HeroSelection;
