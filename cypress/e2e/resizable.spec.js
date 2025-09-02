// 验证 Resizable handler 不应遮盖 Modal
// 选择 demo: ZIndexHandlerNotOverModal（自定义 story，确保 handler 与 Modal 并列渲染并能真实操作 z-index）
describe('Resizable', () => {
    it('handler should not cover modal content', () => {
        cy.visit('http://127.0.0.1:6006/iframe.html?id=resizable--handler-modal&viewMode=story');
        cy.get('button').contains('Open Modal').click();
        cy.get('#modal-content-test').should('exist');
        cy.get('.semi-resizable-handler').then($handler => {
            // 获取 handler 的 z-index
            const handlerZIndex = window.getComputedStyle($handler[0]).zIndex;
            cy.get('.semi-modal').then($modal => {
                // 获取 Modal 的 z-index
                const modalZIndex = window.getComputedStyle($modal[0]).zIndex;
                // 确保 handler 层级不高于 Modal
                expect(Number(handlerZIndex)).to.be.lessThan(Number(modalZIndex));
                // 检查 handler 未遮挡 modal content
                cy.get('#modal-content-test').then($modalContent => {
                    expect($modalContent[0].getBoundingClientRect().top >= $handler[0].getBoundingClientRect().bottom || $modalContent[0].getBoundingClientRect().bottom <= $handler[0].getBoundingClientRect().top || parseInt(handlerZIndex, 10) < parseInt(modalZIndex, 10)).to.be.true;
                });
            });
        });
    });
});
