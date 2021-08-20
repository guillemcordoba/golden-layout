import TestTools from './test-tools';
describe('ground item', function () {
    let layout;
    afterAll(function () {
        layout === null || layout === void 0 ? void 0 : layout.destroy();
    });
    it('component gets wrapped in a stack', function () {
        const rootLayout = {
            root: {
                type: 'component',
                componentType: TestTools.TEST_COMPONENT_NAME
            }
        };
        layout = TestTools.createLayout(rootLayout);
        const glElements = document.querySelectorAll('.lm_goldenlayout');
        expect(glElements.length).toBe(1);
        TestTools.verifyPath('stack.0.component', layout);
    });
});
//# sourceMappingURL=ground-item-tests.js.map