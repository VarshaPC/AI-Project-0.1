import { Component } from "react";

export default class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { error: null };
	}
	static getDerivedStateFromError(error) {
		return { error };
	}
	render() {
		if (this.state.error) return <main className="page-wrap"><p className="eyebrow">BAKEBERRY</p><h1 className="page-title">That didn’t load quite right.</h1><p className="form-error" role="alert">{this.state.error.message}</p><button className="button button-dark" type="button" onClick={() => this.setState({ error: null })}>Try again <span>→</span></button></main>;
		return this.props.children;
	}
}