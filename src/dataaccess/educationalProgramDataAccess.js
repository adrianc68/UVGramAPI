const { Op, Sequelize } = require("sequelize");
const { sequelize } = require("../database/connectionDatabaseSequelize");
const { logger } = require("../helpers/logger");
const { EducationalProgram } = require("../models/EducationalProgram");
const { Faculty } = require("../models/Faculty");
const { Region } = require("../models/Region");

/**
 * Get all educational program available
 * @returns Array with educational programs
 */
const getAllEducationalProgram = async () => {
    let programs = [];
    try {
        programs = await EducationalProgram.findAll({
            raw: true,
            nest: true,
        });
    } catch (error) {
        throw new Error(error);
    }
    return programs;
}

/**
 * Get all Faculties registered
 * @returns Array with faculties
 */
const getAllFacultyAvailables = async () => {
    let faculties = [];
    try {
        faculties = await Faculty.findAll({
            raw: true,
            nest: true
        })
    } catch (error) {
        throw new Error(error);
    }
    return faculties;
}

/**
 * Get all Region registered
 * @returns Array with faculties
 */
const getAllRegion = async () => {
    let region = [];
    try {
        region = await Region.findAll({
            raw: true,
            nest: true,
        })
    } catch (error) {
        throw new Error(error);
    }
    return region;
}

/**
 * Check if a career is registered.
 * @param {*} id the id of career
 * @returns true if it exist otherwise false
 */
const isEducationalProgramRegistered = async (id) => {
    let isRegistered = false;
    try {
        let data = await EducationalProgram.findOne({
            where: {
                id
            }
        });
        isRegistered = (data) ? true : false;
    } catch (error) {
        throw new Error(error);
    }
    return isRegistered;
}

module.exports = { getAllEducationalProgram, getAllFacultyAvailables, getAllRegion, isEducationalProgramRegistered }