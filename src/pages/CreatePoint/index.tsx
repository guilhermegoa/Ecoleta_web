import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import axios from "axios";
import { LeafletMouseEvent } from "leaflet";

import Dropzone from "../../components/DropZone/index";

import api from "../../services/api";

import logo from "../../assets/logo.svg";

import {
  Container,
  Header,
  HeaderLink,
  Form,
  Field,
  Input,
  FieldGroup,
  Select,
  List,
  ListItem,
  ListItemSelected,
} from "./styles";

interface Item {
  id: number;
  name: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState("0");
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("0");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [selectedPosition, setSelectedPosistion] = useState<[number, number]>([
    0,
    0,
  ]);
  const [initialPosition, setInitialPosistion] = useState<[number, number]>([
    0,
    0,
  ]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });
  const history = useHistory();

  useEffect(() => {
    api.get("items").then((response) => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);
        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === "0") {
      return;
    }
    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const cityNames = response.data.map((city) => city.nome);

        setCities(cityNames);
      });
  }, [selectedUf]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      setInitialPosistion([latitude, longitude]);
    });
  }, []);

  const handleSelectUf = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedUf(event.target.value);
  };

  const handleSelectCity = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
  };

  const handleMapClick = (event: LeafletMouseEvent) => {
    setSelectedPosistion([event.latlng.lat, event.latlng.lng]);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectItem = (id: number) => {
    const alreadySelected = selectedItems.findIndex((item) => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems([...filteredItems]);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = new FormData();

    data.append("name", name);
    data.append("email", email);
    data.append("whatsapp", whatsapp);
    data.append("uf", uf);
    data.append("city", city);
    data.append("latitude", String(latitude));
    data.append("longitude", String(longitude));
    data.append("items", items.join(","));

    if (selectedFile) {
      data.append("image", selectedFile);
    }

    await api.post("points", data);

    alert("Ponto de coleta criado");

    history.push("/");
  };

  return (
    <Container>
      <Header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <HeaderLink>
            <FiArrowLeft />
            Voltar para home
          </HeaderLink>
        </Link>
      </Header>
      <Form onSubmit={handleSubmit}>
        <h1>
          Cadastro do <br /> ponto de coleta
        </h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
        </fieldset>
        <Field>
          <label htmlFor="name">Nome da entidade</label>
          <Input type="text" name="name" onChange={handleInputChange} />
        </Field>
        <FieldGroup>
          <Field>
            <label htmlFor="email">E-mail</label>
            <Input type="email" name="email" onChange={handleInputChange} />
          </Field>
          <Field>
            <label htmlFor="whatsapp">Whatsapp</label>
            <Input type="text" name="whatsapp" onChange={handleInputChange} />
          </Field>
        </FieldGroup>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>
        </fieldset>
        <Map
          center={initialPosition} // [-19.859296, -43.998055]
          zoom={15}
          onCLick={handleMapClick}
          style={{
            width: "100%",
            height: "350px",
            borderRadius: "8px",
            marginBottom: "24px",
          }}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={selectedPosition} />
        </Map>
        <FieldGroup>
          <Field>
            <label htmlFor="uf">Estado (UF)</label>
            <Select name="uf" onChange={handleSelectUf} value={selectedUf}>
              <option value="0">Selecione uma UF</option>
              {ufs.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            <label htmlFor="city">Cidade</label>
            <Select
              name="city"
              onChange={handleSelectCity}
              value={selectedCity}
            >
              <option value="0">Selecione uma cidade</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </Select>
          </Field>
        </FieldGroup>

        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>
        </fieldset>
        <List>
          {items.map((item) => {
            return !selectedItems.includes(item.id) ? (
              <ListItem key={item.id} onClick={() => handleSelectItem(item.id)}>
                <img src={item.image_url} alt="" />
                <span>{item.name}</span>
              </ListItem>
            ) : (
              <ListItemSelected
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
              >
                <img src={item.image_url} alt="" />
                <span>{item.name}</span>
              </ListItemSelected>
            );
          })}
        </List>

        <button type="submit">Cadastrar ponto de coleta</button>
      </Form>
    </Container>
  );
};

export default CreatePoint;
