import React from 'react';
import TextArea from '../index';

export const LineNumberDemo = () => (
  <div style={{ width: 400 }}>
    <TextArea 
      showLineNumber 
      lineNumberStart={5} 
      style={{ height: 120 }} 
      className="custom-line-number-textarea"
      rows={4} 
      defaultValue={'第一行\n第二行\n第三行'} 
      lineNumberStyle={{ color: 'red' }} 
    />
  </div>
);

export default {
  title: 'TextArea',
};
