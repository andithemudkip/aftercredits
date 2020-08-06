import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Form, Col, Button, InputGroup } from 'react-bootstrap';
import './SearchBar.css';

class SearchBar extends Component {
    static propTypes = {
        suggestions: PropTypes.instanceOf (Array)
    };
    static defaultProperty = {
        suggestions: []
    };
    constructor (props) {
        super (props);
        this.state = {
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: ""
        };
    }

    onChange = e => {
        const { suggestions } = this.props;
        const userInput = e.currentTarget.value;

        const filteredSuggestions = suggestions.filter (
            suggestion => suggestion.toLowerCase ().indexOf (userInput.toLowerCase ()) > -1
        )

        this.setState ({
            activeSuggestion: 0,
            filteredSuggestions,
            showSuggestions: true,
            userInput: e.currentTarget.value
        });
    }

    onClick = e => {
        // console.log (`search for ${ e.currentTarget.innerText }`);
        this.props.onSearch (e.currentTarget.innerText);
        this.setState ({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: e.currentTarget.innerText
        });
    }

    onKeyDown = e => {
        const { activeSuggestion, filteredSuggestions, userInput } = this.state;

        if (e.keyCode === 13) {
            let input = filteredSuggestions [activeSuggestion] || userInput;
            this.setState ({
                activeSuggestion: 0,
                showSuggestions: false,
                userInput: filteredSuggestions [activeSuggestion] || userInput
            });
            this.props.onSearch (input);
        } else if (e.keyCode === 27) {
            this.setState ({
                activeSuggestion: 0,
                showSuggestions: false,
            });
        } else if (e.keyCode === 38) {
            if (activeSuggestion === 0) return;
            this.setState ({ activeSuggestion: activeSuggestion - 1 });
        } else if (e.keyCode === 40) {
            if (activeSuggestion + 1 === filteredSuggestions.length) return;
            this.setState ({ activeSuggestion: activeSuggestion + 1 });
        }
    }

    onMouseEnter = e => {
        const { filteredSuggestions } = this.state;
        this.setState ({
            activeSuggestion: filteredSuggestions.indexOf (e.currentTarget.innerText)
        });
    }

    render () {
        const {
            onChange,
            onClick,
            onKeyDown,
            state: {
                activeSuggestion,
                filteredSuggestions,
                showSuggestions,
                userInput
            }
        } = this;

        let suggestionsListComponent;
        if (showSuggestions && userInput) {
            if (filteredSuggestions.length) {
                suggestionsListComponent = (
                    <div className = "suggestions">
                        {
                            filteredSuggestions.map ((suggestion, index) => {
                                return (
                                    <div className = {
                                        `search-result ${ activeSuggestion === index ? 'active-result' : '' }`
                                    } key = { suggestion } onClick = { onClick } onMouseEnter = { this.onMouseEnter }>
                                        { suggestion }
                                    </div>
                                )  
                            })
                        }
                    </div>
                )
            } else {
                suggestionsListComponent = <></>;
            }
        }

        return (
            <React.Fragment>
                <Form.Row>
                    <InputGroup size = "lg">
                        <InputGroup.Prepend>
                            <Button variant = "outline-danger" onClick = {() => {
                                this.props.onSearch (null)
                                this.setState ({
                                    userInput: ''
                                });
                            }}>X</Button>
                        </InputGroup.Prepend>
                        <Form.Control
                            onChange = { onChange }
                            onKeyDown = { onKeyDown }
                            value = { userInput }
                            placeholder = 'Movie Title'
                            className = 'search-bar'
                        />
                        <InputGroup.Append>
                            <Button onClick = {() => this.props.onSearch (userInput)}>Search</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form.Row>
                { suggestionsListComponent }
            </React.Fragment>
        )
    }
}
SearchBar.defaultProps = {
    suggestions: []
}

export default SearchBar;