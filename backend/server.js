import express from "express";
import { randomUUID } from "node:crypto";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const duckSightings = [];

const FEET_PARA_CM = 30.48;
const POUND_PARA_GRAM = 453.592;
const YARD_PARA_METER = 0.9144;

function convertValue(value, unit, targetUnit, conversionFactor) {
  if (unit === targetUnit) {
    return value;
  }
  return value * conversionFactor;
}

const DSIN_COORDS = { latitude: -22.233686, longitude: -49.934166 };

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateCaptureMetrics(sighting) {
  const { duck, location } = sighting;

  let operationalCost = 270;
  operationalCost += duck.heightCm * 7;
  operationalCost += duck.weightG * 2;

  const distance = getDistance(
    DSIN_COORDS.latitude,
    DSIN_COORDS.longitude,
    location.latitude,
    location.longitude
  );
  operationalCost += distance * 20;

  let riskLevel = duck.mutations * 5;

  let militaryPower = "Baixo";

  if (duck.status === "desperto") {
    riskLevel += 50;
    militaryPower = "Alto";
    if (duck.superpower?.classifications.includes("Ofensivo"))
      militaryPower = "Crítico";
  } else if (duck.status === "em transe") {
    riskLevel += 20 + (duck.heartRateBpm > 80 ? 25 : 0);
    militaryPower = "Médio";
  }

  const knowledgeGain = 100 + duck.mutations * 50 + (duck.superpower ? 200 : 0);

  return { operationalCost, riskLevel, militaryPower, knowledgeGain };
}

app.get("/patos", (req, res) => {
  res.status(200).json(duckSightings);
});

app.post("/patos", (req, res) => {
  const {
    drone,
    height,
    weight,
    location,
    status,
    heartRateBpm,
    mutations,
    superpower,
  } = req.body;

  if (!drone || !height || !weight || !location || !status || !mutations) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes" });
  }

  if (
    !drone.serialNumber ||
    !location.city ||
    !location.country ||
    location.latitude == null ||
    location.longitude == null ||
    !location.precision
  ) {
    return res
      .status(400)
      .json({ error: "Existem campos relacioandos faltantes" });
  }

  if (status === "desperto" && !superpower) {
    return res.status(400).json({
      error:
        "Informações sobre superpoder são necessárias para o status de desperto.",
    });
  }

  try {
    const newSighting = {
      id: randomUUID(),
      captureAnalysis: null,
      timestamp: new Date().toISOString(),
      drone: {
        serialNumber: drone.serialNumber,
        brand: drone.brand,
        manufacturer: drone.manufacturer,
        countryOfOrigin: drone.countryOfOrigin,
      },
      duck: {
        heightCm: convertValue(height.value, height.unit, "cm", FEET_PARA_CM),
        weightG: convertValue(weight.value, weight.unit, "g", POUND_PARA_GRAM),
        mutations,
        status,
        ...(heartRateBpm && { heartRateBpm }),
        ...(superpower && { superpower }),
      },
      location: {
        city: location.city,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude,
        precisionMeters: convertValue(
          location.precision.value,
          location.precision.unit,
          "m",
          YARD_PARA_METER
        ),
        ...(location.landmark && { landmark: location.landmark }),
      },
    };

    newSighting.captureAnalysis = calculateCaptureMetrics(newSighting);

    duckSightings.push(newSighting);
    res.status(201).json(newSighting);
  } catch (error) {
    res.status(500).json({
      error: "Um erro aconteceu enquanto acontecia o processamento da request",
      details: error.message,
    });
  }
});

app.listen(3000);
