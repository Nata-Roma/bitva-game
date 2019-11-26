import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UIFx from 'uifx';
import rules, { getActivePlayer } from '../rules';

const attackSound = new UIFx(`${process.env.PUBLIC_URL}/sound/attack.mp3`, { volume: 1.0 });

export function withBoardContext(GameScreen) {
    const Board = class extends Component {
        constructor(props) {
            super(props);
            this.state = {
                dragging: null,
            };
            this.cardAim = this.cardAim.bind(this);
            this.cardSelect = this.cardSelect.bind(this);
            this.cardAct = this.cardAct.bind(this);
            this.cardDropped = this.cardDropped.bind(this);
            this.isTarget = this.isTarget.bind(this);
            this.cardOver = this.cardOver.bind(this);
        }

        cardAim() {
            console.log('I am in GameScreen');
            this.setState({
                dragging: null,
            });
        }

        cardSelect(key, card, mode) {
            this.setState((oldState) => {
                if (oldState.dragging && mode === 'click') {
                    return { dragging: null };
                }
                return { dragging: { key, card, mode } };
            });
        }

        malachiteBox() {
            const activePlayer = getActivePlayer(this.props.app);
            // we define item of active player if any
            let itemActive;
            if (Object.keys(activePlayer.item) !== undefined) {
                itemActive = Object.values(activePlayer.item)[0];
            }

            // we define active player if she / he has Malachite box in item
            let playerWithMalachiteBox;
            if (itemActive && itemActive.category === 'generator') {
                playerWithMalachiteBox = activePlayer.hero;
            }
            // if active player has malachite box card
            // every other card drop calls animation of bat card
            if (itemActive && itemActive.category === 'generator' && activePlayer.hero === playerWithMalachiteBox) {
                // this.playAnimation('bat');
                attackSound.play();
            }
        }

        cardAct(target) {
            this.malachiteBox();
            this.props.sendMessage({
                type: 'ACTION',
                activeCard: this.state.dragging.key,
                target,
            });

            this.setState({
                dragging: null,
            });
        }


        cardDropped(target, player) {
            // we run malachite box function to check
            // this card and execute it if any
            this.malachiteBox();

            if (!this.isTarget(target, player)) {
                return;
            }
            this.cardAct(target);
            // we run actionSound function to play sound once player acts
            // this.actionSound(target);
        }

        isTarget(target, player) {
            const activePlayer = getActivePlayer(this.props.app);
            return rules(
                target,
                this.state.dragging,
                player.id === activePlayer.id,
                player,
            );
        }

        cardOver(event, target, player) {
            if (!this.isTarget(target, player)) {
                return;
            }
            event.preventDefault();
        }

        render() {
            const value = {
                dragging: this.state.dragging,
                cardSelect: this.cardSelect,
                cardAct: this.cardAct,
                isTarget: this.isTarget,
                cardDropped: this.cardDropped,
                cardOver: this.cardOver,
                cardAim: this.cardAim,
            };
            return (
                <BoardContext.Provider value={value}>
                    <GameScreen sendMessage={this.props.sendMessage} app={this.props.app} />
                </BoardContext.Provider>
            );
        }
    };

    Board.propTypes = {
        app: PropTypes.object.isRequired,
        sendMessage: PropTypes.func.isRequired,
    };

    return Board;
}

const BoardContext = React.createContext({});

export default BoardContext;