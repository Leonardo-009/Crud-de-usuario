import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import InputMask from 'react-input-mask';


const FormContainer = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  background-color: #f1f1f1;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
  color: #333;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 200px;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
  &[name="fone"] {
    width: 150px;
    padding: 0 5px;
    border: 1px solid #bbb;
    border-radius: 5px;
    height: 40px;
  }
`;


const Label = styled.label`
  font-weight: bold;
`;
const Button = styled.button`
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background: linear-gradient(90deg, #2c73d2, #6c48d6);
  color: white;
  height: 42px;
  transition: all 0.2s ease-in-out;
  right: 50%;
`;

const Select = styled.select`
  width: 120px;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
`;
const Form = ({ getUsers, onEdit, setOnEdit }) => {
  const ref = useRef();
  const [provider, setProvider] = useState("gmail.com");

  useEffect(() => {
    if (onEdit) {
      const user = ref.current;

      user.nome.value = onEdit.nome;
      user.emailName.value = onEdit.email.split("@")[0];
      setProvider(onEdit.email.split("@")[1]);
      user.fone.value = onEdit.fone;
      user.data_nascimento.value = onEdit.data_nascimento;
    }
  }, [onEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = ref.current;

    if (
      !user.nome.value ||
      !user.emailName.value ||
      !user.fone.value ||
      !user.data_nascimento.value
    ) {
      return toast.warn("Preencha todos os campos!");
    }

    if (onEdit) {
      await axios
        .put("http://localhost:8800/" + onEdit.id, {
          nome: user.nome.value,
          email: user.emailName.value + "@" + provider,
          fone: user.fone.value,
          data_nascimento: user.data_nascimento.value,
        })
        .then(({ data }) => toast.success(data))
        .catch(({ data }) => toast.error(data));
    } else {
      await axios
        .post("http://localhost:8800", {
          nome: user.nome.value,
          email: user.emailName.value + "@" + provider,
          fone: user.fone.value,
          data_nascimento: user.data_nascimento.value,
        })
        .then(({ data }) => toast.success(data))
        .catch(({ data }) => toast.error(data));
    }

    user.nome.value = "";
    user.emailName.value = "";
    user.fone.value = "";
    user.data_nascimento.value = "";

    setProvider("gmail.com");
    setOnEdit(null);
    getUsers();
  };

  return (
    <FormContainer ref={ref} onSubmit={handleSubmit}>
      <InputArea>
        <Label>Nome</Label>
        <Input name="nome" defaultValue={onEdit ? onEdit.nome : ""} />
      </InputArea>
      <InputArea>
        <Label>Telefone</Label>
        <InputMask
          mask="(99) 99999-9999"
          maskChar=""
          defaultValue={onEdit ? onEdit.fone : ""}
        >
          {() => <Input name="fone" />}
        </InputMask>
      </InputArea>
      <InputArea>
        <Label>Data de Nascimento</Label>
        <Input
          name="data_nascimento"
          type="date"
          defaultValue={onEdit ? onEdit.data_nascimento : ""}
        />
      </InputArea>
      <InputArea>
        <Label>E-mail</Label>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Input
            name="emailName"
            defaultValue={onEdit ? onEdit.email.split("@")[0] : ""}
            style={{ marginRight: 10 }}
          />
          <Select
            name="emailProvider"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
            <option value="gmail.com">gmail.com</option>
            <option value="hotmail.com">hotmail.com</option>
            <option value="outlook.com">outlook.com</option>
            <option value="yahoo.com">yahoo.com</option>
          </Select>
        </div>
      </InputArea>
      <Input
        name="email"
        value={ref.current?.emailName.value + "@" + provider}
        disabled
      />
      <Button type="submit">{onEdit ? "ATUALIZAR" : "CRIAR"}</Button>
    </FormContainer>
  );
};

export default Form;