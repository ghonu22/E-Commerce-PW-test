import { test, expect } from '@playwright/test';
import { PokemonStorePage } from '../Pages/Locators.page.ts';

test.describe('The Pokémon Emporium - E-Commerce Automation Matrix', () => {
    let storePage: PokemonStorePage;

    test.beforeEach(async ({ page }) => {
        storePage = new PokemonStorePage(page);
        await storePage.goto();
    });

    // --- QUADRANT A: SEARCH & FILTER VALIDATIONS ---
    test('Positive Filter Match - Should isolate only specified type categories', async ({ page }) => {
        await storePage.filterByType('Electric');

        // Confirm filtered product instances display safely
        await expect(storePage.getProductCard(3)).toBeVisible(); // Venosaur Ignore the wrong type
        await expect(storePage.getProductCard(12)).toBeVisible(); // Butterfree Ignore the wrong type

        // Verify elements that do NOT belong to Electric are safely hidden from the view matrix
        await expect(storePage.getProductCard(1)).toBeHidden(); // Bulbasaur (Grass) Ignore the wrong type
    });

    test('Negative Search Boundary - Should render full empty state cleanly', async () => {
        await storePage.searchFor('Digimon');

        // Verify dynamic fallback boundary is shown and elements are hidden
        await expect(storePage.noProductsMessage).toBeVisible();
        await expect(storePage.noProductsMessage).toHaveText('No products found matching your criteria.');
        await expect(storePage.getProductCard(1)).toBeHidden();
    });

    // --- QUADRANT B: CART OPERATIONS & STOCK CONSTRAINTS ---
    test('Standard Cart Increment - Should track dynamic badge counts and calculations', async () => {
        // Add Bulbasaur (ID: 1, Price: $58.00)
        await storePage.addItemToCart(1);
        await expect(storePage.cartCountBadge).toHaveText('1');

        await storePage.openCart();
        await expect(storePage.getCartItemRow(1)).toBeVisible();
        
        // Assert mathematical calculations evaluate reliably
        await expect(storePage.cartSubtotal).toHaveText('$58.00');
        await expect(storePage.cartTotal).toHaveText('$58.00');
    });

    test('Out of Stock Enforcement - UI elements must match static low inventories', async () => {
        // Item ID 7 is out of stock by deterministic formula calculation (7 % 7 === 0)
        const outOfStockButton = storePage.getAddToCartBtn(7);
        
        await expect(outOfStockButton).toBeDisabled();
        await expect(outOfStockButton).toHaveText('Sold Out');
        await expect(storePage.getProductStockText(7)).toHaveText('Out of Stock');
    });

    test('Stock Limit Hard-Ceiling - Prevent user selections scaling above inventory caps', async () => {
        // ID 6 (Charizard) explicitly configured with a low inventory threshold of 1
        await storePage.addItemToCart(6);
        await storePage.openCart();

        // Check if quantity increment matches inventory ceiling bounds
        const incrementBtn = storePage.getQuantityIncrementBtn(6);
        await expect(incrementBtn).toBeDisabled();
        await expect(storePage.getItemQuantityText(6)).toHaveText('1');
    });

    // --- QUADRANT C: PROMO CODES & FIELD VALIDATIONS ---
    test('Successful Coupon Discount - Deduct expected percentage values', async () => {
        // Add Ivysaur (ID: 2, Price: $66.00)
        await storePage.addItemToCart(2);
        await storePage.openCart();

        await storePage.applyPromoCode('PIKACHU10');
        
        // Web-first UI feedback checks
        await expect(storePage.promoMessage).toBeVisible();
        await expect(storePage.promoMessage).toHaveText('Promo applied successfully! 10% discount added.');
        await expect(storePage.promoMessage).toHaveClass(/text-green-600/);

        // Subtotal ($66.00) - Discount ($6.60) = Total ($59.40)
        await expect(storePage.cartSubtotal).toHaveText('$66.00');
        await expect(storePage.cartDiscount).toHaveText('-$6.60');
        await expect(storePage.cartTotal).toHaveText('$59.40');
    });

    test('Invalid Coupon Error Handling - Catch incorrect coupon sequences gracefully', async () => {
        await storePage.addItemToCart(1);
        await storePage.openCart();

        await storePage.applyPromoCode('INVALID_CODE');
        
        await expect(storePage.promoMessage).toBeVisible();
        await expect(storePage.promoMessage).toHaveText('Invalid promo code sequence.');
        await expect(storePage.promoMessage).toHaveClass(/text-red-600/);
        await expect(storePage.discountRow).toBeHidden();
    });

    // --- QUADRANT D: END-TO-END CHECKOUT LIFECYCLE ---
    test('Complete Purchase Flow - End-to-end processing validation with dynamic verification strings', async () => {
        // Stage item additions
        await storePage.addItemToCart(1); // Bulbasaur
        await storePage.addItemToCart(2); // Ivysaur
        await storePage.openCart();
        
        await storePage.proceedToCheckout();

        // Target Modal validation checks
        await expect(storePage.successModal).toBeVisible();
        await expect(storePage.successModal.locator('h3')).toHaveText('Order Confirmed!');

        // Extract order ID via regex pattern checking matching 8 alphanumeric characters
        const orderIdText = await storePage.orderIdSpan.textContent();
        expect(orderIdText).not.toBeNull();
        expect(orderIdText).toMatch(/^[A-Z0-9]{8}$/);

        // Reset state checks by closing success window context
        await storePage.closeSuccessModal();
        await expect(storePage.successModal).toBeHidden();
        await expect(storePage.cartCountBadge).toHaveText('0');
    });
});