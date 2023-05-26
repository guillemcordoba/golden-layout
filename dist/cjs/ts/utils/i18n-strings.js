"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.i18nStrings = exports.I18nStrings = void 0;
const internal_error_1 = require("../errors/internal-error");
/** @public */
var I18nStrings;
(function (I18nStrings) {
    /** @internal */
    let initialised = false;
    /** @internal */
    const infosObject = {
        PopoutCannotBeCreatedWithGroundItemConfig: {
            id: 0 /* I18nStringId.PopoutCannotBeCreatedWithGroundItemConfig */,
            default: 'Popout cannot be created with ground ItemConfig'
        },
        PleaseRegisterAConstructorFunction: {
            id: 1 /* I18nStringId.PleaseRegisterAConstructorFunction */,
            default: 'Please register a constructor function'
        },
        ComponentTypeNotRegisteredAndBindComponentEventHandlerNotAssigned: {
            id: 2 /* I18nStringId.ComponentTypeNotRegisteredAndBindComponentEventHandlerNotAssigned */,
            default: 'Component type not registered and BindComponentEvent handler not assigned',
        },
        ComponentIsAlreadyRegistered: {
            id: 3 /* I18nStringId.ComponentIsAlreadyRegistered */,
            default: 'Component is already registered',
        },
        ComponentIsNotVirtuable: {
            id: 4 /* I18nStringId.ComponentIsNotVirtuable */,
            default: 'Component is not virtuable. Requires rootHtmlElement field/getter',
        },
        VirtualComponentDoesNotHaveRootHtmlElement: {
            id: 5 /* I18nStringId.VirtualComponentDoesNotHaveRootHtmlElement */,
            default: 'Virtual component does not have getter "rootHtmlElement"',
        },
        ItemConfigIsNotTypeComponent: {
            id: 6 /* I18nStringId.ItemConfigIsNotTypeComponent */,
            default: 'ItemConfig is not of type component',
        },
        InvalidNumberPartInSizeString: {
            id: 7 /* I18nStringId.InvalidNumberPartInSizeString */,
            default: 'Invalid number part in size string',
        },
        UnknownUnitInSizeString: {
            id: 8 /* I18nStringId.UnknownUnitInSizeString */,
            default: 'Unknown unit in size string',
        },
        UnsupportedUnitInSizeString: {
            id: 9 /* I18nStringId.UnsupportedUnitInSizeString */,
            default: 'Unsupported unit in size string',
        },
    };
    I18nStrings.idCount = Object.keys(infosObject).length;
    /** @internal */
    const infos = Object.values(infosObject);
    function checkInitialise() {
        if (!initialised) {
            for (let i = 0; i < I18nStrings.idCount; i++) {
                const info = infos[i];
                if (info.id !== i) {
                    throw new internal_error_1.AssertError('INSI00110', `${i}: ${info.id}`);
                }
                else {
                    exports.i18nStrings[i] = info.default;
                }
            }
        }
        initialised = true;
    }
    I18nStrings.checkInitialise = checkInitialise;
})(I18nStrings = exports.I18nStrings || (exports.I18nStrings = {}));
/** @public */
exports.i18nStrings = new Array(I18nStrings.idCount);
//# sourceMappingURL=i18n-strings.js.map