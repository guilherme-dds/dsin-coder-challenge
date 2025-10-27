import { useState, type ChangeEvent, type FormEvent } from "react";
import { Bot, Dna, HeartPulse, MapPin, Zap } from "lucide-react";
import type { Sighting } from "../App";

interface ApiError {
  error: string;
}

interface FormDataShape {
  drone: {
    serialNumber: string;
    brand: string;
    manufacturer: string;
    countryOfOrigin: string;
  };
  height: { value: string; unit: string };
  weight: { value: string; unit: string };
  location: {
    city: string;
    country: string;
    latitude: string;
    longitude: string;
    precision: { value: string; unit: string };
    landmark: string;
  };
  status: string;
  heartRateBpm: string;
  mutations: string;
  superpower: {
    name: string;
    description: string;
    classifications: string;
  };
}

const predefinedSuperpowers = [
  "Rajada de Lasers Oculares",
  "Controle Elétrico",
  "Manipulação da Natureza",
  "Invocador de Brigadeiros",
  "Teleporte Quântico",
  "Grito Supersônico",
];

export function CatalogacaoForm() {
  const [formData, setFormData] = useState<FormDataShape>({
    drone: {
      serialNumber: "DRN-USA-001",
      brand: "KreeTech",
      manufacturer: "S.H.I.E.L.D",
      countryOfOrigin: "Estados Unidos",
    },
    height: { value: "17", unit: "cm" },
    weight: { value: "500", unit: "g" },
    location: {
      city: "Quintana",
      country: "Brasil",
      latitude: "-22.063062",
      longitude: "-50.302088",
      precision: { value: "10", unit: "yd" },
      landmark: "",
    },
    status: "hibernação profunda",
    heartRateBpm: "10",
    mutations: "2",
    superpower: {
      name: "",
      description: "",
      classifications: "",
    },
  });

  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    isError: false,
  });

  const updateNestedState = (state: any, keys: string[], value: any): any => {
    const key = keys[0];
    if (keys.length === 1) {
      return { ...state, [key]: value };
    }
    return {
      ...state,
      [key]: updateNestedState(state[key], keys.slice(1), value),
    };
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    setFormData(
      (prev) => updateNestedState(prev, keys, value) as FormDataShape
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionStatus({ message: "> ENVIANDO DADOS...", isError: false });

    const payload = {
      ...formData,
      height: {
        value: parseFloat(formData.height.value),
        unit: formData.height.unit,
      },
      weight: {
        value: parseFloat(formData.weight.value),
        unit: formData.weight.unit,
      },
      location: {
        ...formData.location,
        latitude: parseFloat(formData.location.latitude),
        longitude: parseFloat(formData.location.longitude),
        precision: {
          value: parseFloat(formData.location.precision.value),
          unit: formData.location.precision.unit,
        },
      },
      mutations: parseInt(formData.mutations),
      ...(formData.status !== "desperto" && {
        heartRateBpm: parseInt(formData.heartRateBpm),
      }),
      ...(formData.status === "desperto" && {
        superpower: {
          ...formData.superpower,
          classifications: formData.superpower.classifications
            .split(",")
            .map((s) => s.trim()),
        },
      }),
    };

    try {
      const response = await fetch("http://localhost:3000/patos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: Sighting | ApiError = await response.json();
      if (!response.ok) {
        throw new Error((data as ApiError).error || "Erro desconhecido");
      }
      const newSighting = data as Sighting;
      setSubmissionStatus({
        message: `> SUCESSO: Espécime ${newSighting.id.slice(
          0,
          8
        )} catalogado.`,
        isError: false,
      });
    } catch (error) {
      setSubmissionStatus({
        message: `> ERRO: ${(error as Error).message}`,
        isError: true,
      });
    }
  };

  return (
    <div className="border-2 border-green-400 bg-black/60 p-4">
      <div className="text-green-400 text-sm tracking-wider mb-4 border-b border-green-400 pb-2">
        CATALOGAÇÃO DOS PATOS PRIMORDIAIS (MISSÃO 1)
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        <div className="border border-green-400/30 p-3">
          <h3 className="text-green-300 tracking-widest mb-3 flex items-center gap-2">
            <Bot size={14} />
            DADOS DO DRONE
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col space-y-1">
              <span className="text-green-400/80">NÚMERO DE SÉRIE</span>
              <input
                type="text"
                name="drone.serialNumber"
                value={formData.drone.serialNumber}
                onChange={handleInputChange}
                className="bg-black/50 border border-green-400/50 p-1 focus:outline-none focus:ring-1 focus:ring-green-400"
              />
            </label>
            <label className="flex flex-col space-y-1">
              <span className="text-green-400/80">PAÍS DE ORIGEM</span>
              <input
                type="text"
                name="drone.countryOfOrigin"
                value={formData.drone.countryOfOrigin}
                onChange={handleInputChange}
                className="bg-black/50 border border-green-400/50 p-1 focus:outline-none focus:ring-1 focus:ring-green-400"
              />
            </label>
            <label className="flex flex-col space-y-1">
              <span className="text-green-400/80">MARCA</span>
              <input
                type="text"
                name="drone.brand"
                value={formData.drone.brand}
                onChange={handleInputChange}
                className="bg-black/50 border border-green-400/50 p-1 focus:outline-none focus:ring-1 focus:ring-green-400"
              />
            </label>
            <label className="flex flex-col space-y-1">
              <span className="text-green-400/80">FABRICANTE</span>
              <input
                type="text"
                name="drone.manufacturer"
                value={formData.drone.manufacturer}
                onChange={handleInputChange}
                className="bg-black/50 border border-green-400/50 p-1 focus:outline-none focus:ring-1 focus:ring-green-400"
              />
            </label>
          </div>
        </div>

        <div className="border border-green-400/30 p-3">
          <h3 className="text-green-300 tracking-widest mb-3 flex items-center gap-2">
            <MapPin size={14} />
            LOCALIZAÇÃO
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col space-y-1">
              <span className="text-green-400/80">CIDADE</span>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleInputChange}
                className="bg-black/50 border border-green-400/50 p-1 focus:outline-none focus:ring-1 focus:ring-green-400"
              />
            </label>
            <label className="flex flex-col space-y-1">
              <span className="text-green-400/80">PAÍS</span>
              <input
                type="text"
                name="location.country"
                value={formData.location.country}
                onChange={handleInputChange}
                className="bg-black/50 border border-green-400/50 p-1 focus:outline-none focus:ring-1 focus:ring-green-400"
              />
            </label>
            <label className="flex flex-col space-y-1">
              <span className="text-green-400/80">LATITUDE</span>
              <input
                type="text"
                name="location.latitude"
                value={formData.location.latitude}
                onChange={handleInputChange}
                className="bg-black/50 border border-green-400/50 p-1 focus:outline-none focus:ring-1 focus:ring-green-400"
              />
            </label>
            <label className="flex flex-col space-y-1">
              <span className="text-green-400/80">LONGITUDE</span>
              <input
                type="text"
                name="location.longitude"
                value={formData.location.longitude}
                onChange={handleInputChange}
                className="bg-black/50 border border-green-400/50 p-1 focus:outline-none focus:ring-1 focus:ring-green-400"
              />
            </label>
            <div className="flex flex-col space-y-1">
              <span className="text-green-400/80">PRECISÃO</span>
              <div className="flex">
                <input
                  type="text"
                  name="location.precision.value"
                  value={formData.location.precision.value}
                  onChange={handleInputChange}
                  className="w-full bg-black/50 border border-green-400/50 p-1 focus:outline-none focus:ring-1 focus:ring-green-400"
                />
                <select
                  name="location.precision.unit"
                  value={formData.location.precision.unit}
                  onChange={handleInputChange}
                  className="bg-black border border-l-0 border-green-400/50 p-1 focus:outline-none focus:ring-1 focus:ring-green-400"
                >
                  <option value="m">m</option>
                  <option value="yd">yd</option>
                </select>
              </div>
            </div>
            <label className="flex flex-col space-y-1">
              <span className="text-green-400/80">
                PONTO DE REFERÊNCIA (OPCIONAL)
              </span>
              <input
                type="text"
                name="location.landmark"
                value={formData.location.landmark}
                onChange={handleInputChange}
                className="bg-black/50 border border-green-400/50 p-1 focus:outline-none focus:ring-1 focus:ring-green-400"
              />
            </label>
          </div>
        </div>

        <div className="border border-green-400/30 p-3">
          <h3 className="text-green-300 tracking-widest mb-3 flex items-center gap-2">
            <Dna size={14} />
            DADOS DO ESPÉCIME
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1">
              <span className="text-green-400/80">ALTURA</span>
              <div className="flex">
                <input
                  type="text"
                  name="height.value"
                  value={formData.height.value}
                  onChange={handleInputChange}
                  className="w-full bg-black/50 border border-green-400/50 p-1 focus:outline-none focus:ring-1 focus:ring-green-400"
                />
                <select
                  name="height.unit"
                  value={formData.height.unit}
                  onChange={handleInputChange}
                  className="bg-black border border-l-0 border-green-400/50 p-1 focus:outline-none focus:ring-1 focus:ring-green-400"
                >
                  <option value="cm">cm</option>
                  <option value="ft">ft</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-green-400/80">PESO</span>
              <div className="flex">
                <input
                  type="text"
                  name="weight.value"
                  value={formData.weight.value}
                  onChange={handleInputChange}
                  className="w-full bg-black/50 border border-green-400/50 p-1 focus:outline-none focus:ring-1 focus:ring-green-400"
                />
                <select
                  name="weight.unit"
                  value={formData.weight.unit}
                  onChange={handleInputChange}
                  className="bg-black border border-l-0 border-green-400/50 p-1 focus:outline-none focus:ring-1 focus:ring-green-400"
                >
                  <option value="g">g</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>
            <label className="flex flex-col space-y-1">
              <span className="text-green-400/80">MUTAÇÕES</span>
              <input
                type="number"
                name="mutations"
                value={formData.mutations}
                onChange={handleInputChange}
                className="bg-black/50 border border-green-400/50 p-1 focus:outline-none focus:ring-1 focus:ring-green-400"
              />
            </label>
            <label className="flex flex-col space-y-1 col-span-3">
              <span className="text-green-400/80">STATUS</span>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="bg-black border border-green-400/50 p-1 focus:outline-none focus:ring-1 focus:ring-green-400"
              >
                <option value="desperto">Desperto</option>
                <option value="em transe">Em Transe</option>
                <option value="hibernação profunda">Hibernação Profunda</option>
              </select>
            </label>

            {formData.status !== "desperto" && (
              <label className="flex flex-col space-y-1 col-span-3">
                <span className="text-green-400/80 flex items-center gap-2">
                  <HeartPulse size={12} />
                  BATIMENTOS CARDÍACOS (BPM)
                </span>
                <input
                  type="number"
                  name="heartRateBpm"
                  value={formData.heartRateBpm}
                  onChange={handleInputChange}
                  className="bg-black/50 border border-green-400/50 p-1 focus:outline-none focus:ring-1 focus:ring-green-400"
                />
              </label>
            )}

            {formData.status === "desperto" && (
              <div className="col-span-3 border border-orange-400/30 p-3 space-y-3">
                <h4 className="text-orange-300 tracking-widest flex items-center gap-2">
                  <Zap size={14} />
                  SUPER-PODER DETECTADO
                </h4>
                <label className="flex flex-col space-y-1">
                  <span className="text-orange-400/80">NOME DO PODER</span>
                  <select
                    name="superpower.name"
                    value={formData.superpower.name}
                    onChange={handleInputChange}
                    className="bg-black border border-orange-400/50 p-1 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  >
                    <option value="">Selecione um poder...</option>
                    {predefinedSuperpowers.map((power) => (
                      <option key={power} value={power}>
                        {power}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col space-y-1">
                  <span className="text-orange-400/80">DESCRIÇÃO</span>
                  <textarea
                    name="superpower.description"
                    value={formData.superpower.description}
                    onChange={handleInputChange}
                    rows={2}
                    className="bg-black/50 border border-orange-400/50 p-1 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                </label>
                <label className="flex flex-col space-y-1">
                  <span className="text-orange-400/80">
                    CLASSIFICAÇÕES (separadas por vírgula)
                  </span>
                  <input
                    type="text"
                    name="superpower.classifications"
                    value={formData.superpower.classifications}
                    onChange={handleInputChange}
                    className="bg-black/50 border border-orange-400/50 p-1 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div
            className={`flex-1 text-xs tracking-wider ${
              submissionStatus.isError ? "text-red-400" : "text-green-300"
            }`}
          >
            {submissionStatus.message}
            {submissionStatus.message && (
              <span className="animate-pulse">_</span>
            )}
          </div>
          <button
            type="submit"
            className="border-2 border-green-400 bg-green-400/10 text-green-300 p-3 hover:bg-green-400/20 transition-colors tracking-wider text-sm"
          >
            CATALOGAR ESPÉCIME
          </button>
        </div>
      </form>
    </div>
  );
}
