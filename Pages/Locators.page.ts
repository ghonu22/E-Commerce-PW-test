import { Page, Locator } from '@playwright/test';

export class PokemonStorePage {
    readonly page: Page;
    
    // Header & Filter Locators
    readonly searchInput: Locator;
    readonly typeFilter: Locator;
    readonly cartToggleBtn: Locator;
    readonly cartCountBadge: Locator;
    readonly noProductsMessage: Locator;
    
    // Cart Modal Locators
    readonly cartModal: Locator;
    readonly closeCartBtn: Locator;
    readonly cartItemsList: Locator;
    readonly promoInput: Locator;
    readonly applyPromoBtn: Locator;
    readonly promoMessage: Locator;
    readonly cartSubtotal: Locator;
    readonly discountRow: Locator;
    readonly cartDiscount: Locator;
    readonly cartTotal: Locator;
    readonly checkoutBtn: Locator;
    
    // Success Modal Locators
    readonly successModal: Locator;
    readonly orderIdSpan: Locator;
    readonly closeSuccessBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Header Init
        this.searchInput = page.getByTestId('search-input');
        this.typeFilter = page.getByTestId('type-filter');
        this.cartToggleBtn = page.getByTestId('cart-toggle-btn');
        this.cartCountBadge = page.getByTestId('cart-count');
        this.noProductsMessage = page.getByTestId('no-products-message');
        
        // Cart Init
        this.cartModal = page.getByTestId('cart-modal');
        this.closeCartBtn = page.getByTestId('close-cart-btn');
        this.cartItemsList = page.getByTestId('cart-items-list');
        this.promoInput = page.getByTestId('promo-input');
        this.applyPromoBtn = page.getByTestId('apply-promo-btn');
        this.promoMessage = page.getByTestId('promo-message');
        this.cartSubtotal = page.getByTestId('cart-subtotal');
        this.discountRow = page.locator('#discountRow'); // targeted container
        this.cartDiscount = page.getByTestId('cart-discount');
        this.cartTotal = page.getByTestId('cart-total');
        this.checkoutBtn = page.getByTestId('checkout-btn');
        
        // Success Init
        this.successModal = page.getByTestId('success-modal');
        this.orderIdSpan = page.getByTestId('order-id');
        this.closeSuccessBtn = page.getByTestId('close-success-btn');
    }

    // Dynamic Product Locators
    getProductCard(id: number): Locator { return this.page.getByTestId(`product-card-${id}`); }
    getAddToCartBtn(id: number): Locator { return this.page.getByTestId(`add-to-cart-${id}`); }
    getProductStockText(id: number): Locator { return this.page.getByTestId(`product-stock-${id}`); }
    getCartItemRow(id: number): Locator { return this.page.getByTestId(`cart-item-${id}`); }
    getQuantityIncrementBtn(id: number): Locator { return this.page.getByTestId(`quantity-increment-${id}`); }
    getQuantityDecrementBtn(id: number): Locator { return this.page.getByTestId(`quantity-decrement-${id}`); }
    getItemQuantityText(id: number): Locator { return this.page.getByTestId(`item-quantity-${id}`); }
    getItemSubtotalText(id: number): Locator { return this.page.getByTestId(`item-subtotal-${id}`); }

    // Navigation Action Flow
    async goto() {
        // Replace with your local host path or test context file location
        await this.page.goto('file:///C:/Test/E-Commerce%20PW%20test/EcomPokemon.html'); 
    }

    // Core Interaction Wrapper Methods
    async searchFor(query: string) {
        await this.searchInput.fill(query);
    }

    async filterByType(type: string) {
        await this.typeFilter.selectOption(type);
    }

    async addItemToCart(id: number) {
        await this.getAddToCartBtn(id).click();
    }

    async openCart() {
        await this.cartToggleBtn.click();
    }

    async applyPromoCode(code: string) {
        await this.promoInput.fill(code);
        await this.applyPromoBtn.click();
    }

    async proceedToCheckout() {
        await this.checkoutBtn.click();
    }

    async closeSuccessModal() {
        await this.closeSuccessBtn.click();
    }
}