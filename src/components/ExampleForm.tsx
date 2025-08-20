import { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: #333;
  text-align: center;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
`;

const ExampleForm = () => {
  const [flightPrice, setFlightPrice] = useState('');
  const [flightData, setFlightData] = useState('');

  return (
    <FormContainer>
      <Title>Search for cheaper flights</Title>
      <div>
        <Label>
          Flight Price:
          <Input
            type="dropdown"
            value={flightPrice}
            onChange={(e) => setFlightPrice(e.target.value)}
          />
        </Label>
      </div>
      <div>
        <Label>
          Flight Data:
          <Input
            type="text"
            value={flightData}
            onChange={(e) => setFlightData(e.target.value)}
          />
        </Label>
      </div>
    </FormContainer>
  );
};

export default ExampleForm;