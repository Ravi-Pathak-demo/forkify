import previewView from './previewView';
import View from './View';
import icons from 'url:../../img/icons.svg';

class BookmarkView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = `No Matching Recipe found, Please try Again (￣ ‘i ￣;)`;
  _successMessage = '';

  _generateMarkup() {
    // console.log(this._data);
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new BookmarkView();
