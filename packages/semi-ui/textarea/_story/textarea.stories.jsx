import React, { useRef } from 'react';
import { TextArea, Button } from '../../index';

export default {
  title: 'Textarea',
}

export const FocusOnCounterDemo = () => {
  const inputRef = useRef();
  return (
    <div data-cy="focus-counter-demo">
      <TextArea ref={inputRef} maxCount={20} defaultValue="Semi Design" style={{ width: 240 }} />
      <div style={{marginTop: 8}}>点击下方 maxCount 区域后 TextArea 应获得焦点</div>
    </div>
  );
};

FocusOnCounterDemo.story = {
  name: 'focus on counter demo',
};
