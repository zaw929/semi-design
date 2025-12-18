import React from 'react';
import { Tabs, TabPane } from '../../index';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';

// This test verifies that when collapsible=true and an activeKey is provided on first render,
// the TabBar scrolls the active tab into view using Element.scrollIntoView.

describe('Tabs collapsible initial scroll', () => {
    it('should scroll active tab into view on initial mount when collapsible and activeKey provided', (done) => {
        const calls = [];
        const scrollSpy = jest.fn(function() {
            // Record the element on which scrollIntoView was called
            calls.push(this);
        });
        // Mock scrollIntoView on HTMLElement prototype to capture calls on DOM elements
        // eslint-disable-next-line no-undef
        HTMLElement.prototype.scrollIntoView = scrollSpy;

        // Stub document.querySelector to ensure we can capture selector used by TabBar
        const originalQuerySelector = document.querySelector;
        const selectorCalls = [];
        const dummyEl = { scrollIntoView: scrollSpy };
        document.querySelector = jest.fn((sel) => {
            selectorCalls.push(sel);
            return dummyEl;
        });

        const tabs = mount(
            <Tabs collapsible activeKey="itemKeyB" type="line">
                <TabPane itemKey="itemKeyA" tab="titleA">contentA</TabPane>
                <TabPane itemKey="itemKeyB" tab="titleB">contentB</TabPane>
                <TabPane itemKey="itemKeyC" tab="titleC">contentC</TabPane>
            </Tabs>
        );

        // Wait a tick to allow componentDidMount setState callback to run and scroll
        setTimeout(() => {
            try {
                // Ensure scrollIntoView was called exactly once
                expect(scrollSpy).toHaveBeenCalledTimes(1);
                // Ensure selector contains active bar item key
                const matched = selectorCalls.some(sel => sel.includes('data-scrollkey="itemKeyB-bar"'));
                expect(matched).toBe(true);
                done();
            } catch (e) {
                done(e);
            } finally {
                // restore original querySelector
                document.querySelector = originalQuerySelector;
            }
        }, 0);
    });
});
