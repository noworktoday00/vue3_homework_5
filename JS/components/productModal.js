export default {
  props: ['id'],
        template:
            `<div
            class="modal fade"
            id="productModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            ref="modal"
        >
            <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content border-0">
                <div class="modal-header bg-dark text-white">
                <h5 class="modal-title" id="exampleModalLabel">
                    <span>{{ product.title }}</span>
                </h5>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                ></button>
                </div>
                <div class="modal-body">
                <div class="row">
                    <div class="col-sm-6">
                    <img class="img-fluid" :src="product.imageUrl" alt="" />
                    </div>
                    <div class="col-sm-6">
                    <span class="badge bg-primary rounded-pill"> </span>
                    <p>商品描述：</p>
                    <p> {{product.description}} </p>
                    <p>商品內容：</p>
                    <p> {{product.content}} </p>
                    <div class="h5" v-if="product.origin_price === product.price"> {{product.price}} 元</div>
                    <div v-else>
                    <del class="h6">  原價 {{product.origin_price}} 元</del>
                    <div class="h5">現在只要 {{product.price}} 元</div>
                    </div>
                    <div>
                        <div class="input-group">
                        <input type="number" class="form-control"
                        min="1" v-model.number="qty"
                        >
                        <button type="button" class="btn btn-primary"
                        @click="addToCart"
                        
                        >
                            加入購物車
                        </button>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>`,
        data() {
            return {
                modal: {},
                product: {},
                qty: 1,
            }
        },
        watch: {
            //監控元件ID的變化就會出發getProduct()
            id() {
                this.getProduct()
            }
        },
        methods: {
            getProduct() {
                const url = `${apiUrl}/api/${apiPath}/product/${this.id}`;
                axios.get(url)
                    .then(res => {
                        console.log(res);
                        this.product = res.data.product;
                    })
                    .catch(err => {
                        alert(err.data.message);
                    });
            },
            openModal() {
                this.modal.show()
            },
            hideModal() {
                this.modal.hide()
            },
            addToCart() {
                console.log(this.qty)
                this.$emit('add-to-cart', this.product.id, this.qty);
            },
        },
        mounted() {
            //使用refs方式取用template元件
            this.modal = new bootstrap.Modal(this.$refs.modal);
        }
}