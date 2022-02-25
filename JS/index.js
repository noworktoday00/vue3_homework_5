import productModal from "./components/productModal.js";
//解構CDN引入套件內需要的功能
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

//定義功能規則
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

//
loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
    generateMessage: localize('zh_TW'),
});

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'vanmoritz';

Vue.createApp({
    data() {
        return {
            products: [],
            tempProduct: [],
            productId: '',
            cartData: [],
            isLoadingItem: '',
            //建立表單內容 參照API格式
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            }
        }
    },
    components: {
        //註冊驗證套件元件
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
        productModal: productModal,
    },
    methods: {
        getProducts() {
            const url = `${apiUrl}/api/${apiPath}/products/all`;
            axios.get(url)
                .then(res => {
                    console.log(res);
                    this.products = res.data.products;
                })
                .catch(err => {
                    alert(err.data.message);
                });
        },
        openProductModal(id) {
            this.productId = id;
            //使用$refs調用元件內的openModal()方法打開元件的modal
            this.$refs.productModal.openModal();
        },
        getCart() {
            //  購物車列表 https://vue3-course-api.hexschool.io/v2/api/vanmoritz/cart
            const url = `${apiUrl}/api/${apiPath}/cart`;
            axios.get(url)
                .then(res => {
                    console.log(res.data.data);
                    this.cartData = res.data.data;
                })
                .catch(err => {
                    alert(err.data.message);
                });
        },
        addToCart(id, qty = 1) {
            //  加入購物車 https://vue3-course-api.hexschool.io/v2/api/vanmoritz/cart
            const url = `${apiUrl}/api/${apiPath}/cart`;
            const data = {
                "product_id": id,
                qty,
            }
            this.isLoadingItem = id;
            axios.post(url, { data })
                .then(res => {
                    console.log(res);
                    alert(res.data.message);
                    this.getCart();
                    this.isLoadingItem = '';
                    this.$refs.productModal.hideModal();
                })
                .catch(err => {
                });
        },
        deleteCartItem(id) {
            //  刪除單一品項  https://vue3-course-api.hexschool.io/v2/api/vanmoritz/cart/{id}
            const url = `${apiUrl}/api/${apiPath}/cart/${id}`;
            this.isLoadingItem = id;
            axios.delete(url)
                .then(res => {
                    console.log(res);
                    alert(res.data.message);
                    this.getCart();
                    this.isLoadingItem = '';
                })
                .catch(err => {
                    alert(err.data.message);
                });
        },
        deleteAllCart() {
            //  刪除全部 https://vue3-course-api.hexschool.io/v2/api/vanmoritz/carts
            const url = `${apiUrl}/api/${apiPath}/carts`;
            axios.delete(url)
                .then(res => {
                    console.log(res);
                    alert(res.data.message);
                    this.getCart();
                })
                .catch(err => {
                    alert(err.data.message);
                });
        },
        updateCartItem(item) {
            //  購物車新增數量 https://vue3-course-api.hexschool.io/v2/api/vanmoritz/cart/{id}
            const url = `${apiUrl}/api/${apiPath}/cart/${item.id}`;
            const data = {
                "product_id": item.id,
                "qty": item.qty,
            };
            console.log(data);

            this.isLoadingItem = item.id;
            axios.put(url, { data })
                .then(res => {
                    console.log(res);
                    alert(res.data.message);
                    this.getCart();
                    this.isLoadingItem = '';
                })
                .catch(err => {
                    alert(err.data.message);
                });
        },
        createOrder() {
            const url = `${apiUrl}/api/${apiPath}/order`;
            const data = {
                data: this.form,
            };
            axios.post(url, data)
                .then(res => {
                    alert(res.data.message);
                    //用$refs調用resetForm的功能
                    this.$refs.form.resetForm();
                    this.getCart();
                })
                .catch(err => {
                    alert(err.data.message);
                });

        }
    },
    mounted() {
        this.getProducts();
        this.getCart();
    },
})
.mount('#app');

