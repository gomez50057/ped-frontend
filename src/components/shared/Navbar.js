"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import PlanesProgramasModal from "./PlanesProgramasModal";

const LOGOS = [
  { src: "/img/Logox2.png", alt: "Gobierno del Estado de Hidalgo y Planeación" },
  { src: "/img/logo.png", alt: "Logo de PED" },
];

const NAV_ITEMS = [
  { label: "Inicio", href: "/" },
  { label: "Actualización del PED", href: "/ped/" },
  {
    label: "Estatal",
    submenu: [
      { label: "Plan Estatal de Desarrollo 2022-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Estatal/Plan%20Estatal%20de%20Desarrollo%202022-2028.pdf" },
       { label: "Actualización del Plan Estatal de Desarrollo 2022-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Estatal/Actualizaci%C3%B3n%20del%20Plan%20Estatal%20de%20Desarrollo%202022-2028.pdf" },
    ]
  },
  {
    label: "Programas Especiales y Sectoriales",
    submenu: [
      { label: "Programa Especial de Desarrollo de Oficialía Mayor 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Sectoriales%20y%20Especiales/Programa%20Especial%20de%20Desarrollo%20de%20Oficial%C3%ADa%20Mayor%202023-2028.pdf" },
      { label: "Programa Especial de Desarrollo de Planeación y Prospectiva 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Sectoriales%20y%20Especiales/Programa%20Especial%20de%20Desarrollo%20de%20Planeaci%C3%B3n%20y%20Prospectiva%202023-2028.pdf" },
      { label: "Programa Sectorial de Desarrollo de Hacienda 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Sectoriales%20y%20Especiales/Programa%20Sectorial%20de%20Desarrollo%20de%20Hacienda%202023-2028.pdf" },
      { label: "Programa Sectorial de Desarrollo para el Bienestar e Inclusión Social 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Sectoriales%20y%20Especiales/Programa%20Sectorial%20de%20Desarrollo%20para%20el%20Bienestar%20e%20Inclusi%C3%B3n%20Social%202023-2028.pdf" },
      { label: "Programa Sectorial de Desarrollo de Infraestructura Pública y Desarrollo Urbano Sostenible 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Sectoriales%20y%20Especiales/Programa%20Sectorial%20de%20Desarrollo%20de%20Infraestructura%20P%C3%BAblica%20y%20Desarrollo%20Urbano%20Sostenible%202023-2028.pdf" },
      { label: "Programa Sectorial de Desarrollo Económico 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Sectoriales%20y%20Especiales/Programa%20Sectorial%20de%20Desarrollo%20Econ%C3%B3mico%202023-2028.pdf" },
      { label: "Programa Sectorial de Desarrollo de Medio Ambiente y Recursos Naturales 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Sectoriales%20y%20Especiales/Programa%20Sectorial%20de%20Desarrollo%20de%20Medio%20Ambiente%20y%20Recursos%20Naturales%202023-2028.pdf" },
      { label: "Programa Sectorial de Desarrollo de Agricultura y Desarrollo Rural 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Sectoriales%20y%20Especiales/Programa%20Sectorial%20de%20Desarrollo%20de%20Agricultura%20y%20Desarrollo%20Rural%202023-2028.pdf" },
      { label: "Programa Sectorial de Desarrollo de Turismo Sostenible 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Sectoriales%20y%20Especiales/Programa%20Sectorial%20de%20Desarrollo%20de%20Turismo%20Sostenible%202023-2028.pdf" },
      { label: "Programa Sectorial de Desarrollo de Contraloría 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Sectoriales%20y%20Especiales/Programa%20Sectorial%20de%20Desarrollo%20de%20Contralor%C3%ADa%202023-2028.pdf" },
      { label: "Programa Sectorial de Desarrollo de Educación 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Sectoriales%20y%20Especiales/Programa%20Sectorial%20de%20Desarrollo%20de%20Educaci%C3%B3n%202023-2028.pdf" },
      { label: "Programa Sectorial de Salud 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Sectoriales%20y%20Especiales/Programa%20Sectorial%20de%20Desarrollo%20de%20Salud%202023-2028.pdf" },
      { label: "Programa Sectorial de Desarrollo de Seguridad Pública 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Sectoriales%20y%20Especiales/Programa%20Sectorial%20de%20Desarrollo%20de%20Seguridad%20P%C3%BAblica%202023-2028.pdf" },
      { label: "Programa Sectorial de Desarrollo del Trabajo y la Previsión Social 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Sectoriales%20y%20Especiales/Programa%20Sectorial%20de%20Desarrollo%20del%20Trabajo%20y%20la%20Previsi%C3%B3n%20Social%202023-2028.pdf" },
      { label: "Programa Sectorial de Desarrollo de Movilidad y Transporte 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Sectoriales%20y%20Especiales/Programa%20Sectorial%20de%20Desarrollo%20de%20Movilidad%20y%20Transporte%202023-2028.pdf" },
      { label: "Programa Sectorial de Desarrollo de Cultura 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Sectoriales%20y%20Especiales/Programa%20Sectorial%20de%20Desarrollo%20de%20Cultura%202023-2028.pdf" },
      { label: "Programa Especial de Desarrollo de Procuración de Justicia 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Sectoriales%20y%20Especiales/Programa%20Especial%20de%20Desarrollo%20de%20Procuraci%C3%B3n%20de%20Justicia%202023-2028.pdf" },
      { label: "Programa Sectorial de Desarrollo de Gobierno 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Sectoriales%20y%20Especiales/Programa%20Sectorial%20de%20Desarrollo%20de%20Gobierno%202023-2028.pdf" },
      { label: "Programa Especial de Desarrollo de la Secretaría del Despacho de la Persona Titular del Poder Ejecutivo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Sectoriales%20y%20Especiales/Programa%20Especial%20de%20Desarrollo%20de%20la%20Secretar%C3%ADa%20del%20Despacho%20de%20la%20Persona%20Titular%20del%20Poder%20Ejecutivo%202023-2028.pdf" },
      { label: "Programa Especial para el Desarrollo Integral de Recuperación Académica 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Sectoriales%20y%20Especiales/Programa%20Especial%20para%20el%20Desarrollo%20Integral%20de%20Recuperaci%C3%B3n%20Acad%C3%A9mica%202024-2028.pdf" },
    ]
  },
  {
    label: "Programas Institucionales",
    submenu: [
      { label: "Programa Institucional de Desarrollo Colegio de Bachilleres del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20Colegio%20de%20Bachilleres%20del%20Estado%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Agencia de Desarrollo Valle de Plata 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Agencia%20de%20Desarrollo%20Valle%20de%20Plata%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Agencia Estatal de Energía de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Agencia%20Estatal%20de%20Energ%C3%ADa%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Comisión de Agua y Alcantarillado de Sistemas Intermunicipales 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Comisi%C3%B3n%20de%20Agua%20y%20Alcantarillado%20de%20Sistemas%20Intermunicipales%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Comisión de Agua y Alcantarillado del Sistema Valle del Mezquital 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Comisi%C3%B3n%20de%20Agua%20y%20Alcantarillado%20del%20Sistema%20Valle%20del%20Mezquital%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Comisión Estatal de Biodiversidad de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Comisi%C3%B3n%20Estatal%20de%20Biodiversidad%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Comisión Estatal de Vivienda 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Comisi%C3%B3n%20Estatal%20de%20Vivienda%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Comisión Estatal del Agua y Alcantarillado 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Comisi%C3%B3n%20Estatal%20del%20Agua%20y%20Alcantarillado%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Comisión Estatal para el Desarrollo Sostenible de los Pueblos Indígenas 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Comisi%C3%B3n%20Estatal%20para%20el%20Desarrollo%20Sostenible%20de%20los%20Pueblos%20Ind%C3%ADgenas%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Corporación de Fomento de Infraestructura Industrial 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Corporaci%C3%B3n%20de%20Fomento%20de%20Infraestructura%20Industrial%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Escuela de Música del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Escuela%20de%20M%C3%BAsica%20del%20Estado%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Operadora de Eventos del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Operadora%20de%20Eventos%20del%20Estado%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Policía Industrial Bancaria del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Polic%C3%ADa%20Industrial%20Bancaria%20del%20Estado%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Secretaría Técnica del Sistema Estatal Anticorrupción de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Secretar%C3%ADa%20T%C3%A9cnica%20del%20Sistema%20Estatal%20Anticorrupci%C3%B3n%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Universidad Intercultural del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Universidad%20Intercultural%20del%20Estado%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Universidad Politécnica de Huejutla 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Universidad%20Polit%C3%A9cnica%20de%20Huejutla%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Universidad Politécnica de Pachuca 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Universidad%20Polit%C3%A9cnica%20de%20Pachuca%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Universidad Politécnica de Tulancingo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Universidad%20Polit%C3%A9cnica%20de%20Tulancingo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Universidad Politécnica de Metropolitana de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Universidad%20Polit%C3%A9cnica%20Metropolitana%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Universidad Tecnológica de la Huasteca Hidalguense 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Universidad%20Tecnol%C3%B3gica%20de%20la%20Huasteca%20Hidalguense%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Universidad Tecnológica de la Zona Metropoliatana del Valle de México 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Universidad%20Tecnol%C3%B3gica%20de%20la%20Zona%20Metropolitana%20del%20Valle%20de%20M%C3%A9xico%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Universidad Tecnológica de Tula-Tepeji 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Universidad%20Tecnol%C3%B3gica%20de%20Tula-Tepeji%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Universidad Tecnológica del Valle del Mezquital 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Universidad%20Tecnol%C3%B3gica%20del%20Valle%20del%20Mezquital%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de Servicios de Salud de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20Servicios%20de%20Salud%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Bachillerato del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Bachillerato%20del%20Estado%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Centro Estatal de Maquinaria para el Desarrollo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Centro%20Estatal%20de%20Maquinaria%20para%20el%20Desarrollo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Consejo de Ciencia, Tecnología e Innovación de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Consejo%20de%20Ciencia,%20Tecnolog%C3%ADa%20e%20Innovaci%C3%B3n%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Consejo Estatal para la Cultura y las Artes de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Consejo%20Estatal%20para%20la%20Cultura%20y%20las%20Artes%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Distrito de Educación, Salud, Ciencia, Tecnología e Innovación 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Distrito%20de%20Educaci%C3%B3n,%20Salud,%20Ciencia,%20Tecnolog%C3%ADa%20e%20Innovaci%C3%B3n%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Instituto Catastral del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Instituto%20Catastral%20del%20Estado%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Instituto de Capacitación para el Trabajo del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Instituto%20de%20Capacitaci%C3%B3n%20para%20el%20Trabajo%20del%20Estado%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Instituto Hidalguense de Competitividad Empresarial 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Instituto%20Hidalguense%20de%20Competitividad%20Empresarial%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Instituto Hidalguense de Educación 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Instituto%20Hidalguense%20de%20Educaci%C3%B3n%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Instituto Hidalguense de Educación para Adultos 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Instituto%20Hidalguense%20de%20Educaci%C3%B3n%20para%20Adultos%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Instituto Hidalguense de Financiamiento a la Educación Superior 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Instituto%20Hidalguense%20de%20Financiamiento%20a%20la%20Educaci%C3%B3n%20Superior%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Instituto Hidalguense de la Juventud 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Instituto%20Hidalguense%20de%20la%20Juventud%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Instituto Hidalguense de las Mujeres 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Instituto%20Hidalguense%20de%20las%20Mujeres%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Instituto Hidalguense del Deporte 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Instituto%20Hidalguense%20del%20Deporte%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Instituto Hidalguense para Devolver al Pueblo lo Robado 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Instituto%20Hidalguense%20para%20Devolver%20al%20Pueblo%20lo%20Robado%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Instituto para la Atención de las y los Adultos Mayores del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Instituto%20para%20la%20Atenci%C3%B3n%20de%20las%20y%20los%20Adultos%20Mayores%20del%20Estado%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Instituto Tecnológico Superior de Huichapan 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Instituto%20Tecnol%C3%B3gico%20Superior%20de%20Huichapan%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Museo Interactivo para la Niñez y la Juventud Hidalguense \"El Rehilete\" 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Museo%20Interactivo%20para%20la%20Ni%C3%B1ez%20y%20la%20Juventud%20Hidalguense%20%22El%20Rehilete%22%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Sistema de Transporte Convencional de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Sistema%20de%20Transporte%20Convencional%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Sistema de Transporte Masivo de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Sistema%20Integrado%20de%20Transporte%20Masivo%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Sistema para el Desarrollo Integral de la Familia del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Sistema%20para%20el%20Desarrollo%20Integral%20de%20la%20Familia%20del%20Estado%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Universidad Tecnológica de la Sierra Hidalguense del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/PID%20de%20la%20Universidad%20Tecnol%C3%B3gica%20de%20la%20Sierra%20Hidalguense%20del%20Estado%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Universidad Tecnológica de Mineral de la Reforma del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/PID%20de%20la%20Universidad%20Tecnol%C3%B3gica%20de%20Mineral%20de%20la%20Reforma%20del%20Estado%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Colegio de Estudios Científicos y Tecnológicos del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/PID%20del%20Colegio%20de%20Estudios,%20Cient%C3%ADficos%20y%20Tecnol%C3%B3gicos%20del%20Estado%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Colegio de El Colegio del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20El%20Colegio%20del%20Estado%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Universidad Digital del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Universidad%20Digital%20del%20Estado%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Universidad Politécnica de la Energía del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/PID%20de%20la%20Universidad%20Polit%C3%A9cnica%20de%20la%20Energ%C3%ADa%20del%20Estado%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Universidad Tecnológica de Tulancingo del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/PID%20de%20la%20Universidad%20Tecnol%C3%B3gica%20de%20Tulancingo%20del%20Estado%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Centro de Conciliación Laboral del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Centro%20de%20Conciliaci%C3%B3n%20Laboral%20del%20Estado%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Centro de Justicia para Mujeres del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/PID%20del%20Centro%20de%20Justicia%20para%20Mujeres%20del%20Estado%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Colegio de Educación  Profesional Técnica del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/PID%20del%20Colegio%20de%20Educaci%C3%B3n%20Profesional%20T%C3%A9cnica%20del%20Estado%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Instituto Técnico Superior del Occidente del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/PID%20del%20Instituto%20Tecnol%C3%B3gico%20Superior%20del%20Occidente%20del%20Estado%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Instituto Técnico Superior del Oriente del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/PID%20del%20Instituto%20Tecnol%C3%B3gico%20Superior%20del%20Oriente%20del%20Estado%20de%20Hidalgo%202023-2028.pdf" },
      { label: "Programa Institucional de Desarrollo del Instituto Hidalguense para el Desarrollo Municipal 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Instituto%20Hidalguense%20para%20el%20Desarrollo%20Municipal%202023%20-%202028.pdf" },
      { label: "Programa Institucional de Desarrollo del Instituto Hidalguense para Infraestructura Física Educatival 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20del%20Instituto%20Hidalguense%20para%20la%20Infraestructura%20F%C3%ADsica%20Educativa%202023%20-%202028.pdf" },
      { label: "Programa Institucional de Desarrollo de Desarrollo de Radio y Televisión de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20Radio%20y%20Televisi%C3%B3n%20de%20Hidalgo%202023%20-%202028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Universidad Tecnológica Minera de Zimapán 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Universidad%20Tecnol%C3%B3gica%20Minera%20de%20Zimap%C3%A1n%202023%20-%202028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Universidad Politécnica de Francisco I Madero 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Universidad%20Polit%C3%A9cnica%20de%20Francisco%20I%20Madero%202023%20-%202028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Ciudad de las Mujeres del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Ciudad%20de%20las%20Mujeres%20del%20Estado%20de%20Hidalgo%202023%20-%202028.pdf" },
      { label: "Programa Institucional de Desarrollo de la Comisión Ejecutiva de Atención a Víctimas del Estado de Hidalgo 2023-2028", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/Programas%20Institucionales/Programa%20Institucional%20de%20Desarrollo%20de%20la%20Comisi%C3%B3n%20Ejecutiva%20de%20Atenci%C3%B3n%20a%20V%C3%ADctimas%20del%20Estado%20de%20Hidalgo%202023%20-%202028.pdf" },
    ]
  },
  {
    label: "Planes Municipales de Desarrollo",
    submenu: [
      { label: "Plan Municipal de Desarrollo de Acaxochitlán", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/ACAXOCHITL%C3%81N/Plan%20Municipal%20de%20Desarrollo%20de%20Acaxochitl%C3%A1n%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Actopan", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/ACTOPAN/Plan%20Municipal%20de%20Desarrollo%20de%20Actopan%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Agua Blanca de Iturbide", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/AGUA%20BLANCA%20DE%20ITURBIDE/Plan%20Municipal%20de%20Desarrollo%20de%20Agua%20Blanca%20de%20Iturbide%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Ajacuba", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/AJACUBA/Plan%20Municipal%20de%20Desarrollo%20de%20Ajacuba%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Alfajayucan", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/ALFAJAYUCAN/Plan%20Municipal%20de%20Desarrollo%20de%20Alfajayucan%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Almoloya", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/ALMOLOYA/Plan%20Municipal%20de%20Desarrollo%20de%20Almoloya%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Apan", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/APAN/Plan%20Municipal%20de%20Desarrollo%20de%20Apan%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de El Arenal", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/EL%20ARENAL/Plan%20Municipal%20de%20Desarrollo%20de%20El%20Arenal%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Atitalaquia", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/ATITALAQUIA/Plan%20Municipal%20de%20Desarrollo%20de%20Atitalaquia%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Atlapexco", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/ATLAPEXCO/Plan%20Municipal%20de%20Desarrollo%20de%20Atlapexco%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Atotonilco de Tula", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/ATOTONILCO%20DE%20TULA/Plan%20Municipal%20de%20Desarrollo%20de%20Atotonilco%20de%20Tula%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Atotonilco el Grande", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/BibliotecaDigitaldePlaneación/INSTRUMENTOSPORMUNICIPIOS/ATOTONILCOELGRANDE/PlanMunicipaldeDesarrollodeAtotonilcoelGrande2024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Calnali", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/BibliotecaDigitaldePlaneación/INSTRUMENTOSPORMUNICIPIOS/CALNALI/PlanMunicipaldeDesarrollodeCalnali2024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Cardonal", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/CARDONAL/Plan%20Municipal%20de%20Desarrollo%20de%20Cardonal%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Cuautepec de Hinojosa", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/CUAUTEPEC%20DE%20HINOJOSA/Plan%20Municipal%20de%20Desarrollo%20de%20Cuautepec%20de%20Hinojosa%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Chapantongo", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/CHAPANTONGO/Plan%20Municipal%20de%20Desarrollo%20de%20Chapantongo%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Chapulhuacán", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/CHAPULHUAC%C3%81N/Plan%20Municipal%20de%20Desarrollo%20de%20Chapulhuacan%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Chilcuautla", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/CHILCUAUTLA/Plan%20Municipal%20de%20Desarrollo%20de%20Chilcuautla%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Eloxochitlán", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/ELOXOCHITL%C3%81N/Plan%20Municipal%20de%20Desarrollo%20de%20Eloxochitl%C3%A1n%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Emiliano Zapata", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/EMILIANO%20ZAPATA/Plan%20Municipal%20de%20Desarrollo%20de%20Emiliano%20Zapata%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Epazoyucan", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/EPAZOYUCAN/Plan%20Municipal%20de%20Desarrollo%20de%20Epazoyucan%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Francisco I. Madero", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/FRANCISCO%20I.%20MADERO/Plan%20Municipal%20de%20Desarrollo%20de%20Francisco%20I.%20Madero%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Huasca de Ocampo", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/HUASCA%20DE%20OCAMPO/Plan%20Municipal%20de%20Desarrollo%20de%20Huasca%20de%20Ocampo%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Huautla", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/HUAUTLA/Plan%20Municipal%20de%20Desarrollo%20de%20Huautla%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Huazalingo", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/HUAZALINGO/Plan%20Municipal%20de%20Desarrollo%20de%20Huazalingo%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Huehuetla", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/HUEHUETLA/Plan%20Municipal%20de%20Desarrollo%20de%20Huehuetla%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Huejutla de Reyes", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/HUEJUTLA%20DE%20REYES/Plan%20Municipal%20de%20Desarrollo%20de%20Huejutla%20de%20Reyes%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Huichapan", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/HUICHAPAN/Plan%20Municipal%20de%20Desarrollo%20de%20Huichapan%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Ixmiquilpan", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/IXMIQUILPAN/Plan%20Municipal%20de%20Desarrollo%20de%20Ixmiquilpan%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Jacala de Ledezma", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/JACALA%20DE%20LEDEZMA/Plan%20Municipal%20de%20Desarrollo%20de%20Jacala%20de%20Ledezma%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Jaltocán", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/JALTOC%C3%81N/Plan%20Municipal%20de%20Desarrollo%20de%20Jaltoc%C3%A1n%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Juárez Hidalgo", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/JU%C3%81REZ%20HIDALGO/Plan%20Municipal%20de%20Desarrollo%20de%20Juarez%20Hidalgo%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de La Misión", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/LA%20MISI%C3%93N/Plan%20Municipal%20de%20Desarrollo%20de%20La%20Misi%C3%B3n%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Lolotla", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/LOLOTLA/Plan%20Municipal%20de%20Desarrollo%20de%20Lolotla%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Metepec", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/METEPEC/Plan%20Municipal%20de%20Desarrollo%20de%20Metepec%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Metztitlán", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/METZTITL%C3%81N/Plan%20Municipal%20de%20Desarrollo%20de%20Metztitl%C3%A1n%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Mineral de la Reforma", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/MINERAL%20DE%20LA%20REFORMA/Plan%20Municipal%20de%20Desarrollo%20de%20Mineral%20de%20la%20Reforma%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Mineral del Chico", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/MINERAL%20DEL%20CHICO/Plan%20Municipal%20de%20Desarrollo%20de%20Mineral%20del%20Chico%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Mineral del Monte", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/MINERAL%20DEL%20MONTE/Plan%20Municipal%20de%20Desarrollo%20de%20Mineral%20del%20Monte%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Mixquiahuala de Juárez", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/MIXQUIAHUALA%20DE%20JU%C3%81REZ/Plan%20Municipal%20de%20Desarrollo%20de%20Mixquiahuala%20de%20Ju%C3%A1rez%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Molango de Escamilla", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/MOLANGO%20DE%20ESCAMILLA/Plan%20Municipal%20de%20Desarrollo%20de%20Molango%20de%20Escamilla%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Nicolás Flores", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/NICOL%C3%81S%20FLORES/Plan%20Municipal%20de%20Desarrollo%20de%20Nicol%C3%A1s%20Flores%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Nopala de Villagrán", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/NOPALA%20DE%20VILLAGR%C3%81N/Plan%20Municipal%20de%20Desarrollo%20de%20Nopala%20de%20Villagr%C3%A1n%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Omitlán de Juárez", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/OMITL%C3%81N%20DE%20JU%C3%81REZ/Plan%20Municipal%20de%20Desarrollo%20de%20Omitl%C3%A1n%20de%20Ju%C3%A1rez%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Pachuca de Soto", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/PACHUCA%20DE%20SOTO/Plan%20Municipal%20de%20Desarrollo%20de%20Pachuca%20de%20Soto%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Pacula", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/PACULA/Plan%20Municipal%20de%20Desarrollo%20de%20Pacula%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Pisaflores", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/PISAFLORES/Plan%20Municipal%20de%20Desarrollo%20de%20Pisaflores%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Progreso de Obregón", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/PROGRESO%20DE%20OBREG%C3%93N/Plan%20Municipal%20de%20Desarrollo%20de%20Progreso%20de%20Obreg%C3%B3n%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de San Agustín Metzquititlán", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/SAN%20AGUST%C3%8DN%20METZQUITITL%C3%81N/Plan%20Municipal%20de%20Desarrollo%20de%20San%20Agustin%20Metzquititlan%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de San Agustín Tlaxiaca", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/SAN%20AGUST%C3%8DN%20TLAXIACA/Plan%20Municipal%20de%20Desarrollo%20de%20San%20Agust%C3%ADn%20Tlaxiaca%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de San Bartolo Tutotepec", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/SAN%20BARTOLO%20TUTOTEPEC/Plan%20Municipal%20de%20Desarrollo%20de%20San%20Bartolo%20Tutotepec%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de San Felipe Orizatlán", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/SAN%20FELIPE%20ORIZATL%C3%81N/Plan%20Municipal%20de%20Desarrollo%20de%20San%20Felipe%20Orizatl%C3%A1n%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de San Salvador", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/SAN%20SALVADOR/Plan%20Municipal%20de%20Desarrollo%20de%20San%20Salvador%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Santiago de Anaya", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/SANTIAGO%20DE%20ANAYA/Plan%20Municipal%20de%20Desarrollo%20de%20Santiago%20de%20Anaya%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Santiago Tulantepec de Lugo Guerrero", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/SANTIAGO%20TULANTEPEC%20DE%20LUGO%20GUERRERO/Plan%20Municipal%20de%20Desarrollo%20de%20Santiago%20Tulantepec%20de%20Lugo%20Guerrero%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Singuilucan", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/SINGUILUCAN/Plan%20Municipal%20de%20Desarrollo%20de%20Singuilucan%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Tasquillo", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/TASQUILLO/Plan%20Municipal%20de%20Desarrollo%20de%20Tasquillo%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Tecozautla", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/TECOZAUTLA/Plan%20Municipal%20de%20Desarrollo%20de%20Tecozautla%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Tenango de Doria", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/TENANGO%20DE%20DORIA/Plan%20Municipal%20de%20Desarrollo%20de%20Tenango%20de%20Doria%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Tepeapulco", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/TEPEAPULCO/Plan%20Municipal%20de%20Desarrollo%20de%20Tepeapulco%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Tepehuacán de Guerrero", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/TEPEHUAC%C3%81N%20DE%20GUERRERO/Plan%20Municipal%20de%20Desarrollo%20de%20Tepehuac%C3%A1n%20de%20Guerrero%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Tepeji del Río de Ocampo", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/TEPEJI%20DEL%20R%C3%8DO%20DE%20OCAMPO/Plan%20Municipal%20de%20Desarrollo%20de%20Tepeji%20del%20R%C3%ADo%20de%20Ocampo%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Tepetitlán", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/TEPETITL%C3%81N/Plan%20Municipal%20de%20Desarrollo%20de%20Tepetitl%C3%A1n%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Tetepango", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/TETEPANGO/Plan%20Municipal%20de%20Desarrollo%20de%20Tetepango%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Tezontepec de Aldama", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/TEZONTEPEC%20DE%20ALDAMA/Plan%20Municipal%20de%20Desarrollo%20de%20Tezontepec%20de%20Aldama%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Tianguistengo", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/TIANGUISTENGO/Plan%20Municipal%20de%20Desarrollo%20de%20Tianguistengo%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Tizayuca", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/TIZAYUCA/Plan%20Municipal%20de%20Desarrollo%20de%20Tizayuca%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Tlahuelilpan", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/TLAHUELILPAN/Plan%20Municipal%20de%20Desarrollo%20de%20Tlahuelilpan%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Tlahuiltepa", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/TLAHUILTEPA/Plan%20Municipal%20de%20Desarrollo%20de%20Tlahuiltepa%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Tlanalapa", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/TLANALAPA/Plan%20Municipal%20de%20Desarrollo%20de%20Tlanalapa%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Tlanchinol", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/TLANCHINOL/Plan%20Municipal%20de%20Desarrollo%20de%20Tlanchinol%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Tlaxcoapan", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/TLAXCOAPAN/Plan%20Municipal%20de%20Desarrollo%20de%20Tlaxcoapan%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Tolcayuca", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/TOLCAYUCA/Plan%20Municipal%20de%20Desarrollo%20de%20Tolcayuca%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Tula de Allende", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/TULA%20DE%20ALLENDE/Plan%20Municipal%20de%20Desarrollo%20de%20Tula%20de%20Allende%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Tulancingo de Bravo", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/TULANCINGO%20DE%20BRAVO/Plan%20Municipal%20de%20Desarrollo%20de%20Tulancingo%20de%20Bravo%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Villa de Tezontepec", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/VILLA%20DE%20TEZONTEPEC/Plan%20Municipal%20de%20Desarrollo%20de%20Villa%20de%20Tezontepec%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Xochiatipan", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/XOCHIATIPAN/Plan%20Municipal%20de%20Desarrollo%20de%20Xochiatipan%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Xochicoatlán", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/XOCHICOATL%C3%81N/Plan%20Municipal%20de%20Desarrollo%20de%20Xochicoatl%C3%A1n%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Yahualica", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/YAHUALICA/Plan%20Municipal%20de%20Desarrollo%20de%20Yahualica%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Zacualtipán de Ángeles", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/ZACUALTIP%C3%81N%20DE%20%C3%81NGELES/Plan%20Municipal%20de%20Desarrollo%20de%20Zacualtip%C3%A1n%20de%20%C3%81ngeles%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Zapotlán de Juárez", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/ZAPOTL%C3%81N%20DE%20JU%C3%81REZ/Plan%20Municipal%20de%20Desarrollo%20de%20Zapotlan%20de%20Juarez%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Zempoala", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/ZEMPOALA/Plan%20Municipal%20de%20Desarrollo%20de%20Zempoala%202024-2027.pdf" },
      { label: "Plan Municipal de Desarrollo de Zimapán", href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/Biblioteca%20Digital%20de%20Planeaci%C3%B3n/INSTRUMENTOS%20POR%20MUNICIPIOS/ZIMAP%C3%81N/Plan%20Municipal%20de%20Desarrollo%20de%20Zimap%C3%A1n%202024-2027.pdf" },
    ]
  },
  { label: "Plataforma estratégica", href: "/login" },
];

const DOC_GROUP_LABELS = new Set([
  "Estatal",
  "Programas Especiales y Sectoriales",
  "Programas Institucionales",
  "Planes Municipales de Desarrollo",
]);

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewerBlocked, setViewerBlocked] = useState(false);

  // Modal state
  const [planesModalOpen, setPlanesModalOpen] = useState(false);

  const lastScrollPos = useRef(0);
  const pathname = usePathname();

  const docGroups = useMemo(() => {
    return NAV_ITEMS.filter((i) => DOC_GROUP_LABELS.has(i.label) && Array.isArray(i.submenu));
  }, []);

  const topNavItems = useMemo(() => {
    // Solo los items normales (sin los 4 grupos)
    return NAV_ITEMS.filter((i) => !DOC_GROUP_LABELS.has(i.label));
  }, []);

  const navbarItems = useMemo(() => {
    // Inserta "Planes y Programas" después de Inicio (si existe)
    const items = [...topNavItems];
    const idxInicio = items.findIndex((i) => i.label === "Inicio");
    const insertAt = idxInicio >= 0 ? idxInicio + 1 : 0;

    items.splice(insertAt, 0, { label: "Planes y Programas", action: "OPEN_PLANES_MODAL" });
    return items;
  }, [topNavItems]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setIsVisible(currentScrollPos < lastScrollPos.current || currentScrollPos < 10);
      lastScrollPos.current = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleViewerToggle = (event) => {
      setViewerBlocked(Boolean(event.detail?.open));
    };

    window.addEventListener("ped-viewer-toggle", handleViewerToggle);
    return () => window.removeEventListener("ped-viewer-toggle", handleViewerToggle);
  }, []);

  // Cierra menú/modal al cambiar ruta
  useEffect(() => {
    setMenuOpen(false);
    setPlanesModalOpen(false);
  }, [pathname]);

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);
  const closeAll = useCallback(() => {
    setMenuOpen(false);
    setPlanesModalOpen(false);
  }, []);

  const openPlanesModal = useCallback(() => {
    setMenuOpen(false); // por si está en mobile
    setPlanesModalOpen(true);
  }, []);

  const renderNavItems = (isMobile = false) => (
    <ul className={isMobile ? styles.navbarOpcMobile : styles.navbarOpcDesktop}>
      {navbarItems.map((item) => (
        <li key={item.label} className={styles.navItem}>
          {item.action === "OPEN_PLANES_MODAL" ? (
            <button
              type="button"
              className={styles.navButton}
              onClick={openPlanesModal}
            >
              {item.label}
            </button>
          ) : (
            <Link
              href={item.href}
              onClick={isMobile ? closeAll : undefined}
              className={pathname === item.href ? styles.activeLink : undefined}
            >
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <nav
        className={`${styles.Navbar} 
          ${isVisible ? styles.active : styles.hidden} 
          ${lastScrollPos.current > 100 ? styles.scrolled : ""}
        `}
        style={{ pointerEvents: viewerBlocked ? "none" : "auto" }}
      >
        <div className={styles.NavbarList}>
          <div className={styles.NavbarImg}>
            {LOGOS.map((logo) => (
              <img key={logo.src} src={logo.src} alt={logo.alt} />
            ))}
          </div>

          <div className={styles.NavbarInicio}>
            <div className={styles.NavbarCirculo} onClick={toggleMenu} role="button" tabIndex={0}>
              <img src="/img/estrella.webp" alt="Menú" />
            </div>

            {renderNavItems(false)}
          </div>
        </div>
      </nav>

      <div
        className={`${styles.NavbarMenuContainer} ${menuOpen ? styles.menuOpen : ""}`}
        style={{ pointerEvents: viewerBlocked ? "none" : "auto" }}
      >
        {renderNavItems(true)}
      </div>

      {/* Modal Planes y Programas */}
      <PlanesProgramasModal
        open={planesModalOpen}
        onClose={() => setPlanesModalOpen(false)}
        groups={docGroups}
      />
    </>
  );
}
