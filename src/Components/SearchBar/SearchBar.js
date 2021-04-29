import React from "react";
import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state= {
      term: ''
    }

    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  handleTermChange(e) {
    let searchTerm = e.target.value;
    this.setState({term: searchTerm})
  }

  search() {
    this.props.onSearch(this.state.term)
  }

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist"
          onChange={this.handleTermChange} />
        <button className="SearchButton" onClick={this.search}>SEARCH</button>
      </div>
    )};
}

export default SearchBar;
