import styled from 'styled-components';

const Box = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  padding-top: 10px;
`;

const DragBox = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 4px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? 'lightblue' : 'white')};
`;

const ExtrasBox = styled(Box)`
  background-color: #ccc;
  padding-bottom: 15px;
`;

export {
  Box,
  DragBox,
  ExtrasBox,
}