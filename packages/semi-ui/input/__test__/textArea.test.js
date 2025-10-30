import TextArea from '../textarea';
import Icon from '../../icons/index';
import { BASE_CLASS_PREFIX } from '../../../semi-foundation/base/constants';
import truncateValue from '../../../semi-foundation/input/util/truncateValue';
import GraphemeSplitter from 'grapheme-splitter';
import { isString } from 'lodash';

function getValueLength(str) {
    if (isString(str)) {
        const splitter = new GraphemeSplitter();
        return splitter.countGraphemes(str);
    } else {
        return -1;
    }
}

describe('TextArea', () => {
    // 行号功能：showLineNumber=false时不显示行号栏
    it('should not display line number bar when showLineNumber is false', () => {
        const wrapper = mount(<TextArea showLineNumber={false} value="line1\nline2" />);
        expect(wrapper.find('.semi-input-textarea-lineNumberBar')).toHaveLength(0);
    });

    // 行号功能：showLineNumber=true时显示行号栏且与文本内容行数保持一致
    it('should display line number bar with correct count when showLineNumber is true', () => {
        const wrapper = mount(<TextArea showLineNumber value="a\nb\nc" />);
        const lineNumberBar = wrapper.find('.semi-input-textarea-lineNumberBar');
        expect(lineNumberBar).toHaveLength(1);
        // 3 行
        expect(lineNumberBar.find('div').children()).toHaveLength(3);
        // 行号内容
        expect(lineNumberBar.find('div').at(0).text()).toEqual('1');
        expect(lineNumberBar.find('div').at(1).text()).toEqual('2');
        expect(lineNumberBar.find('div').at(2).text()).toEqual('3');
    });

    // 行号功能：自定义起始行号
    it('should start line number with lineNumberStart', () => {
        const wrapper = mount(<TextArea showLineNumber value="x\ny" lineNumberStart={5} />);
        const lineNumberBar = wrapper.find('.semi-input-textarea-lineNumberBar');
        expect(lineNumberBar.find('div').at(0).text()).toEqual('5');
        expect(lineNumberBar.find('div').at(1).text()).toEqual('6');
    });

    // 行号功能：支持自定义className和style
    it('should apply custom className and style for lineNumberBar', () => {
        const wrapper = mount(
            <TextArea showLineNumber value="m\nn" lineNumberClassName="custom-bar" lineNumberStyle={{ background: 'yellow' }} />
        );
        const lineNumberBar = wrapper.find('.semi-input-textarea-lineNumberBar');
        expect(lineNumberBar.hasClass('custom-bar')).toBe(true);
        expect(lineNumberBar.prop('style').background).toBe('yellow');
    });

    // 行号功能：滚动联动，textarea滚动时同步
    it('should sync lineNumberBar scroll with textarea scroll', () => {
        // 模拟容器，确保 lineNumberBar 有 ref
        const wrapper = mount(<TextArea showLineNumber value={"a\nb\nc\nd\ne\nf\ng"} rows={3} style={{ height: 60 }}/>
        );
        const textarea = wrapper.find('textarea');
        const lineNumberBar = wrapper.find('.semi-input-textarea-lineNumberBar');
        // 人工设置 scrollTop
        textarea.getDOMNode().scrollTop = 20;
        wrapper.find('textarea').simulate('scroll', { target: { scrollTop: 20 } });
        expect(lineNumberBar.getDOMNode().scrollTop).toBe(20);
    });

    // 行号功能：常规功能不受影响（计数器、清空等）
    it('should work with showCounter and showClear along with lineNumberBar', () => {
        const wrapper = mount(
            <TextArea showLineNumber showCounter maxCount={10} showClear defaultValue="semi design" />
        );
        // 行号栏存在
        expect(wrapper.find('.semi-input-textarea-lineNumberBar')).toHaveLength(1);
        // 清空按钮存在
        expect(wrapper.find('.semi-input-clearbtn')).toHaveLength(1);
        // 计数器存在
        expect(wrapper.find('.semi-input-textarea-counter')).toHaveLength(1);
    });

    it('TextArea with custom className & style', () => {
        const wrapper = mount(<TextArea className="test" style={{ color: 'red' }} />);
        expect(wrapper.hasClass('test')).toEqual(true);
        expect(wrapper.find('div.test')).toHaveStyle('color', 'red');
    });

    it('TextArea defaultValue', () => {
        let defaultValue = 'semi';
        const textAreaWithDefaultValue = mount(<TextArea defaultValue={defaultValue} />);
        const textareaDom = textAreaWithDefaultValue.find('textarea');
        expect(textareaDom.instance().value).toEqual(defaultValue);
    });

    it('TextArea onChange trigger when value change', () => {
        let textAreaValue = 'semi';
        let event = { target: { value: textAreaValue } };
        let onChange = value => {
            console.log(value);
        };
        let spyOnChange = sinon.spy(onChange);
        const textArea = mount(<TextArea onChange={spyOnChange} />);
        textArea.find('textarea').simulate('change', event);
        expect(spyOnChange.calledOnce).toBe(true);
        expect(spyOnChange.calledWithMatch(textAreaValue)).toBe(true);
    });

    it('TextArea show maxCount', () => {
        const textarea = mount(<TextArea maxCount={10} />);
        const counter = textarea.find(`.${BASE_CLASS_PREFIX}-input-textarea-counter`);
        expect(counter.instance().textContent).toEqual('0/10');
        textarea.setProps({ value: 'semi' });
        expect(counter.instance().textContent).toEqual('4/10');
    });

    it('TextArea with placeholder', () => {
        let placeholderText = 'semi placeholder';
        const textarea = mount(<TextArea placeholder={placeholderText} />);
        let textareaDom = textarea.find('textarea');
        expect(textareaDom.props().placeholder).toEqual(placeholderText);
    });

    it('TextArea disabled', () => {
        const textarea = mount(<TextArea disabled />);
        let textareaDom = textarea.find(`textarea.${BASE_CLASS_PREFIX}-input-textarea-disabled`);
        expect(textareaDom.props().disabled).toEqual(true);
    });

    it('TextArea showClear / onClear', () => {
        const spyOnClear = sinon.spy(() => {});
        const textarea = mount(<TextArea showClear defaultValue="123" onClear={spyOnClear} />);
        textarea
            .simulate('mouseEnter', {})
            .find(`.${BASE_CLASS_PREFIX}-input-clearbtn`)
            .simulate('click');
        expect(spyOnClear.calledOnce).toBe(true);
        expect(textarea.find(`.${BASE_CLASS_PREFIX}-input-textarea`).getDOMNode().textContent).toEqual('');
    });

    // TODO
    // it('TextArea autosize', () => {
    //     let placeholderText = 'semi placeholder';
    //     const textarea = mount(<TextArea autoSize />);
    //     let textareaDom = textarea.find('textarea');
    //     expect(textareaDom.props().placeholder).toEqual(placeholderText);
    // })

    it('TextArea onEnterPress', () => {
        let onEnterPress = e => {
            console.log(e);
        };
        let spyOnPressEnter = sinon.spy(onEnterPress);
        const textArea = mount(<TextArea onEnterPress={spyOnPressEnter} />);
        let event = { key: 'Enter', keyCode: 13 };
        // textArea.find('textarea').simulate('keypress', event);
        textArea.find('textarea').simulate('keydown', event);
        expect(spyOnPressEnter.calledOnce).toBe(true);
    });

    it('TextArea controlled mode', () => {
        let onChange = e => {
            console.log(e);
        };
        let spyOnChange = sinon.spy(onChange);
        const textArea = mount(<TextArea onChange={spyOnChange} value="semi" />);
        const textareaDom = textArea.find('textarea');
        expect(textareaDom.instance().value).toEqual('semi');
        let newValue = 'vita lemon';
        let event = { target: { value: newValue } };
        textArea.find('textarea').simulate('change', event);
        expect(spyOnChange.calledOnce).toBe(true);
        expect(spyOnChange.calledWithMatch(newValue)).toBe(true);
        textArea.setProps({ value: newValue });
        expect(textareaDom.instance().value).toEqual(newValue);
    });

    it('TextArea maxCount exceed', async () => {
        const defaultValue = '💖💖💖💖💖💖💖💖💖💖';
        const textarea = mount(<TextArea defaultValue={defaultValue} maxCount={10} />);
        const counter = textarea.find(`.${BASE_CLASS_PREFIX}-input-textarea-counter`);
        expect(counter.hasClass('semi-input-textarea-counter-exceed')).toEqual(true);
        textarea.setProps({ getValueLength });
        const counter2 = textarea.find(`.${BASE_CLASS_PREFIX}-input-textarea-counter`);
        expect(counter2.hasClass('semi-input-textarea-counter-exceed')).toEqual(false);
    });

    it('test minLength', () => {
        let inputValue = '💖💖💖';
        let inputValue1 = '💖💖💖💖';
        let minLength = 4;
        let event = { target: { value: inputValue } };
        let event1 = { target: { value: inputValue1 } };

        let onChange = value => {
            console.log(value);
        };
        let spyOnChange = sinon.spy(onChange);
        const textArea = mount(
            <TextArea onChange={spyOnChange} minLength={minLength} getValueLength={getValueLength} />
        );
        const textAreaDom = textArea.find('textarea');

        textAreaDom.simulate('change', event);
        expect(spyOnChange.calledOnce).toBe(true);
        expect(spyOnChange.calledWithMatch(textAreaDom)).toBe(true);
        expect(textAreaDom.instance().minLength).toEqual(inputValue.length + (minLength - getValueLength(inputValue)));

        textAreaDom.simulate('change', event1);
        expect(spyOnChange.calledWithMatch(textAreaDom)).toBe(true);
        expect(textAreaDom.instance().minLength).toEqual(minLength);
    });

    it('test maxLength + truncateValue', () => {
        function truncateValue(inputValue, maxLength, getValueLength) {
            let event = { target: { value: inputValue } };
            let onChange = value => {
                console.log(value);
            };

            let spyOnChange = sinon.spy(onChange);
            const textArea = mount(
                <TextArea onChange={spyOnChange} maxLength={maxLength} getValueLength={getValueLength} />
            );
            const textAreaDom = textArea.find('textarea');
            textAreaDom.simulate('change', event);
            expect(spyOnChange.calledOnce).toBe(true);
            return textAreaDom.instance().value;
        }

        const testCases = [
            // 自定义valueLength
            ['Semi', 5, getValueLength, 'Semi'],
            ['Semi Design', 4, getValueLength, 'Semi'],
            ['💖💖💖💖💖💖💖💖💖💖👨👩👧👦', 10, getValueLength, '💖💖💖💖💖💖💖💖💖💖'],
            ['💖', -1, getValueLength, ''],
            ['🆗', 1, getValueLength, '🆗'],
        ];

        for (let [value, length, fc, result] of testCases) {
            expect(truncateValue(value, length, fc)).toBe(result);
        }
    });

    it('test truncateValue', () => {
        expect(truncateValue({ value: 'Semi Design', getValueLength, maxLength: 4 })).toBe('Semi');
        expect(truncateValue({ value: 'Semi', getValueLength, maxLength: 4 })).toBe('Semi');
        expect(truncateValue({ value: 'Se', getValueLength, maxLength: 1 })).toBe('S');
        expect(truncateValue({ value: 'S', getValueLength, maxLength: 2 })).toBe('S');
        expect(truncateValue({ value: '', getValueLength, maxLength: 2 })).toBe('');

        expect(truncateValue({ value: '💖💖💖💖💖', getValueLength, maxLength: 4 })).toBe('💖💖💖💖');
        expect(truncateValue({ value: '💖💖💖💖', getValueLength, maxLength: 4 })).toBe('💖💖💖💖');
        expect(truncateValue({ value: '💖', getValueLength, maxLength: 1 })).toBe('💖');
    });

    it('test truncateValue function call time', () => {
        function truncateValue(inputValue, maxLength) {
            let event = { target: { value: inputValue } };

            let spyTruncateValue = sinon.spy((str) => {
                console.log('call getValueLength', str);
                if (isString(str)) {
                    const splitter = new GraphemeSplitter();
                    return splitter.countGraphemes(str);
                } else {
                    return 0;
                }
            });
            
            const textArea = mount(
                <TextArea maxLength={maxLength} getValueLength={spyTruncateValue} />
            );
            const textAreaDom = textArea.find('textarea');
            textAreaDom.simulate('change', event);
            // 超出判断一次，截断判断 LogN 次
            const expectedValue = 1 + Math.ceil(Math.log2(inputValue.length));
            console.log('expectedValue', expectedValue);
            expect(spyTruncateValue.callCount).toBeLessThanOrEqual(expectedValue);
            return textAreaDom.instance().value;
        }

        const testCases = [
            ['Semi Design', 4],
            [Array.from({ length: 1000 }).fill('👨‍👩‍👧‍👦').join(''), 500],
        ];

        for (let [value, length, expectedCalcTimes] of testCases) {
            truncateValue(value, length, expectedCalcTimes);
        }
    });

    it('test onCompositionStart callback', () => {
        const spyOnCompositionStart = sinon.spy();
        const textArea = mount(<TextArea onCompositionStart={spyOnCompositionStart} />);
        const textareaDom = textArea.find('textarea');
        
        textareaDom.simulate('compositionstart', { target: { value: 'test' } });
        expect(spyOnCompositionStart.calledOnce).toBe(true);
    });

    it('test onCompositionEnd callback', () => {
        const spyOnCompositionEnd = sinon.spy();
        const textArea = mount(<TextArea onCompositionEnd={spyOnCompositionEnd} />);
        const textareaDom = textArea.find('textarea');
        
        textareaDom.simulate('compositionend', { target: { value: 'test' } });
        expect(spyOnCompositionEnd.calledOnce).toBe(true);
    });

    it('test onCompositionUpdate callback', () => {
        const spyOnCompositionUpdate = sinon.spy();
        const textArea = mount(<TextArea onCompositionUpdate={spyOnCompositionUpdate} />);
        const textareaDom = textArea.find('textarea');
        
        textareaDom.simulate('compositionupdate', { target: { value: 'test' } });
        expect(spyOnCompositionUpdate.calledOnce).toBe(true);
    });
});
