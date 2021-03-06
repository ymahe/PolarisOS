// @flow
const Joi = require('joi');
const LRMapping = require('../../../../mappings/pipeline');
const MMapping = require('../../crud/mapping');
const ValFunctions = require('../../../pipeline/validator/valfunctions');
const FormatFunctions = require('../../../pipeline/formatter/formatfunctions');

const Mapping: Object = LRMapping.msw
    .mappings.pipeline.properties;

const Validation: Array<any> = [
];

const Formatting: Array<any> = [
    {
        formatters: a => FormatFunctions.oarray_to_array(a),
        completers: a => FormatFunctions.oarray_to_array(a),
        transformers: a => FormatFunctions.oarray_to_array(a),
        validators: a => FormatFunctions.oarray_to_array(a),
        defaults: a => FormatFunctions.oarray_to_array(a),
    },
    {
        'formatters.function.arguments': a => FormatFunctions.oarray_to_array(a),
        'completers.function.arguments': a => FormatFunctions.oarray_to_array(a),
    },

];

const Completion: Array<any> = [];

const Defaults: Object = {};

const Messages: Object = {
    set: 'Pipeline is successfully added',
    remove: 'Pipeline is successfully removed',
    modify: 'Pipeline is successfully modified',
};

module.exports = {
    RawMapping: Mapping,
    Mapping: new MMapping(Mapping),
    Pipelines: [{
        Validation,
        Formatting,
        Completion,
        Defaults,
    }],
    Messages,
    Name: 'Pipeline',
};
