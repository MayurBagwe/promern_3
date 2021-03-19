/* eslint "react/react-in-jsx-scope": "off" */
/* globals React ReactDOM */
/* eslint "react/jsx-no-undef": "off" */
/* eslint "no-alert": "off" */

// eslint-disable-next-line react/prefer-stateless-function
class AppHeader extends React.Component {
  render() {
    return (
      <div>
        <h1>My Company Inventory</h1>
        <h3 style={{ color: 'red' }}>Showing all available products</h3>
        <hr />
      </div>
    );
  }
}

// eslint-disable-next-line react/prefer-stateless-function
class ProductTable extends React.Component {
  render() {
    const rowStyle = {
      border: '2px solid silver',
      padding: 4,
      backgroundColor: ' #d9d9d9',
    };
    const { products } = this.props;
    const productRow = products.map(product => (
      <ProductRow
        key={product.id}
        rowStyle={rowStyle}
        productObj={product}
      />
    ));
    return (
      <table style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={rowStyle}>Product Name</th>
            <th style={rowStyle}>Price</th>
            <th style={rowStyle}>Category</th>
            <th style={rowStyle}>Image</th>
          </tr>
        </thead>
        <tbody>{productRow}</tbody>
      </table>
    );
  }
}

// eslint-disable-next-line react/prefer-stateless-function
class ProductRow extends React.Component {
  render() {
    const rowStyle = {
      border: '2px solid silver',
      padding: 4,
    };
    const { productObj } = this.props;
    const display$ = `$ ${productObj.price}`;
    return (
      <tr>
        <td style={rowStyle}>{productObj.name}</td>
        <td style={rowStyle}>{display$}</td>
        <td style={rowStyle}>{productObj.category}</td>
        <td style={rowStyle}>
          <a rel="noreferrer" target="_blank" href={productObj.image}>
            View
          </a>
        </td>
      </tr>
    );
  }
}

class AddProduct extends React.Component {
  constructor() {
    // console.log('Add prod constructor');
    super();
    this.state = { value: '$' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;

    const product = {
      category: form.category.value,
      price: form.price.value,
      name: form.productName.value,
      image: form.imageURL.value,
    };
    const { addProduct } = this.props;
    addProduct(product);
    form.price.value = '';
    form.productName.value = '';
    form.imageURL.value = '';
    form.category.value = '';
    this.state.value = '$';
  }

  render() {
    const { value } = this.state;
    return (

      <div>
        <form name="productAdd" onSubmit={this.handleSubmit}>
          <div className="formStyle">
            <label htmlFor="category">
              Category
              <br />
              <select name="category">
                <option>Shirts</option>
                <option>Jeans</option>
                <option>Jackets</option>
                <option>Sweaters</option>
                <option>Accessories</option>
              </select>
            </label>
          </div>
          <div className="formStyle">
            <label htmlFor="price">
              Price Per Unit
              <br />

              <input
                type="text"
                name="price"
                value={value}
                onChange={this.handleChange}
              />
            </label>
          </div>

          <div className="formStyle">
            <label htmlFor="productname">
              ProductName
              <br />

              <input type="text" name="productName" id="product" />
            </label>
          </div>
          <div className="formStyle">
            <label htmlFor="image">
              Image Url
              <br />
              <input type="text" name="imageURL" id="imageURL" />
            </label>
          </div>
          <div>
            <label htmlFor="addProduct">
              <input type="submit" value="Add Product" />
            </label>
          </div>
        </form>
      </div>
    );
  }
}

async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    const result = await response.json();

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code === 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
    return null;
  }
}

class ProductList extends React.Component {
  constructor() {
  //  console.log('Prod list constructor executed');
    super();
    this.state = {
      products: [],
    };
    this.addProduct = this.addProduct.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    // constructing a GraphQL query
    const query = `query{
        productsList{
            id name price 
        category image
        }
      }`;

    const data = await graphQLFetch(query);
    if (data) {
      //    console.log('Final data ', data);
      this.setState({ products: data.productsList });
    }
  }

  async addProduct(product) {
    const query = `mutation productsAdd($product: ProductInputs!) {
      productsAdd(product: $product) {
        id
      }
    }`;

    const data = await graphQLFetch(query, { product });
    if (data) {
      this.loadData();
    }
  }

  render() {
    const { products } = this.state;
    return (
      <React.Fragment>
        <AppHeader />
        <ProductTable products={products} />
        <hr />
        <h3 style={{ color: 'red' }}>Add a new product to inventory</h3>
        <AddProduct addProduct={this.addProduct} />
      </React.Fragment>
    );
  }
}
const element = <ProductList />;

ReactDOM.render(element, document.getElementById('root'));
