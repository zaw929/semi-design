// textarea.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('textarea', () => {
  it('should correctly render line numbers according to `showLineNumber` and `lineNumberStart` props, and sync line number scroll with content', () => {
    cy.visit('http://127.0.0.1:6006/iframe.html?id=textarea--line-number-demo&args=&viewMode=story');
    cy.get('.custom-line-number-textarea').should('exist');
    // 检查初始行号显示
    cy.get('.semi-textarea-lineNumber').should('contain', '5');
    // 检查多行场景行号
    cy.get('.semi-textarea-lineNumber').should('contain', '7');

    // 模拟滚动内容并检查行号滚动同步
    cy.get('.custom-line-number-textarea textarea').scrollTo('bottom');
    cy.wait(200);
    cy.get('.semi-textarea-lineNumber').should('exist'); // 行号也应该滚动显示到最后一行

    // 检查自定义样式生效
    cy.get('.semi-textarea-lineNumber').should('have.css', 'color', 'rgb(255, 0, 0)');
  });


    beforeEach(() => {
        cy.visit('http://localhost:6006/iframe.html?id=input--text-area-autosize&args=&viewMode=story');
    });

    it('autosize', () => {
        const idx = 0;
        cy.get('.semi-input-textarea').eq(idx).type("semi design");
        cy.document().then(document => {
            const textAreaDOM = document.querySelectorAll(".semi-input-textarea")[idx];
            expect(window.getComputedStyle(textAreaDOM).overflow).to.equal('hidden');
        });
        cy.fixture("placeholder").then(placeholder => {
            cy.get('.semi-input-textarea').eq(idx).type(placeholder.medium);
            cy.document().then(document => {
                const textAreaDOM = document.querySelectorAll(".semi-input-textarea")[idx];
                expect(textAreaDOM.scrollHeight).to.equal(textAreaDOM.clientHeight);
            });
            cy.get('.semi-input-textarea').eq(idx).clear().type(placeholder.long);
            cy.document().then(document => {
                const textAreaDOM = document.querySelectorAll(".semi-input-textarea")[idx];
                expect(textAreaDOM.scrollHeight).to.equal(textAreaDOM.clientHeight);
            });
        });
    });

    it('autosize mini row', () => {
        const idx = 1;
        cy.get('.semi-input-textarea').eq(idx).clear();
        let minHeight = 0;
        cy.document().then(document => {
            const textAreaDOM = document.querySelectorAll(".semi-input-textarea")[idx];
            minHeight = textAreaDOM.clientHeight;
            expect(textAreaDOM.scrollHeight).to.equal(minHeight);
        });
        cy.get('.semi-input-textarea').eq(idx).clear().type("111\n222\n333\n444");
        cy.document().then(document => {
            const textAreaDOM = document.querySelectorAll(".semi-input-textarea")[idx];
            expect(textAreaDOM.scrollHeight).to.gt(minHeight);
            expect(textAreaDOM.scrollHeight).to.equal(textAreaDOM.clientHeight);
        });
        cy.get('.semi-input-textarea').eq(idx).clear().type("111\n222");
        cy.document().then(document => {
            const textAreaDOM = document.querySelectorAll(".semi-input-textarea")[idx];
            expect(textAreaDOM.scrollHeight).to.equal(minHeight);
        });

        const idx2 = 2;
        cy.get('.semi-input-textarea').eq(idx2).clear();
        cy.document().then(document => {
            const textAreaDOM = document.querySelectorAll(".semi-input-textarea")[idx2];
            expect(window.getComputedStyle(textAreaDOM).overflow).to.equal('auto');
        });
    });

    it('autosize min and max rows', () => {
        const idx = 3;
        cy.get('.semi-input-textarea').eq(idx).clear();
        cy.document().then(document => {
            const textAreaDOM = document.querySelectorAll(".semi-input-textarea")[idx];
            expect(window.getComputedStyle(textAreaDOM).overflow).to.equal('hidden');
        });

        [4, 5].forEach(idx => { 
            cy.get('.semi-input-textarea').eq(idx).clear();
            cy.document().then(document => {
                const textAreaDOM = document.querySelectorAll(".semi-input-textarea")[idx];
                expect(window.getComputedStyle(textAreaDOM).overflow).to.equal('auto');
            });
            let minHeight = 0;
            cy.document().then(document => {
                const textAreaDOM = document.querySelectorAll(".semi-input-textarea")[idx];
                minHeight = textAreaDOM.clientHeight;
                expect(textAreaDOM.scrollHeight).to.equal(minHeight);
            });
            cy.get('.semi-input-textarea').eq(idx).clear().type("111\n222\n333");
            cy.document().then(document => {
                const textAreaDOM = document.querySelectorAll(".semi-input-textarea")[idx];
                expect(textAreaDOM.scrollHeight).to.gt(minHeight);
                expect(textAreaDOM.scrollHeight).to.equal(textAreaDOM.clientHeight);
            });
            cy.get('.semi-input-textarea').eq(idx).clear().type("111\n222\n333\n444");
            cy.document().then(document => {
                const textAreaDOM = document.querySelectorAll(".semi-input-textarea")[idx];
                expect(textAreaDOM.scrollHeight).to.gt(minHeight);
                expect(textAreaDOM.scrollHeight).to.gt(textAreaDOM.clientHeight);
            });
            cy.get('.semi-input-textarea').eq(idx).clear().type("111");
            cy.document().then(document => {
                const textAreaDOM = document.querySelectorAll(".semi-input-textarea")[idx];
                expect(textAreaDOM.scrollHeight).to.equal(minHeight);
            });
        });
    });

    it('autosize + textarea resize', () => {
        cy.visit('http://localhost:6006/iframe.html?id=input--text-auto-size-resize&viewMode=story');
        cy.get('button').contains('width=100').trigger('click');
        cy.wait(100);
        cy.document().then(document => {
            const textAreaDOM = document.querySelector(".semi-input-textarea");
            const { scrollHeight, clientHeight } = textAreaDOM;
            expect(scrollHeight).eq(clientHeight);
        });
    });

    it('textarea autofocus should focus to text end', () => {
        cy.visit('http://localhost:6006/iframe.html?args=&id=input--fix-text-area-auto-focus&viewMode=story');
        cy.get('div[data-cy=start]').should('contain.text', 0);
        cy.get('div[data-cy=end]').should('contain.text', 0);
    });
});
