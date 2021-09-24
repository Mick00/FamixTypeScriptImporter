import { TS2Famix } from "../src/ts2famix";
import 'jest-extended';

const filePaths = ["resources/Access1.ts"];
const importer = new TS2Famix();

const fmxRep2 = importer.famixRepFromPath(filePaths);
const jsonOutput = fmxRep2.getJSON();

let parsedModel: Array<any>;
var accessCls;
var accessClsMethods;

describe('Access', () => {
    it("should contain an Access class with one method: returnAccessName and one attribute: accessName", async () => {
        parsedModel = JSON.parse(jsonOutput);
        accessCls = parsedModel.filter(el => (el.FM3 == "FamixTypeScript.Class" && el.name == "accessClass"))[0];
        expect(accessCls.methods.length).toBe(1);
        expect(accessCls.attributes.length).toBe(1);
        let methodNames: string[] = ['returnAccessName'];

        accessClsMethods = parsedModel.filter(e => accessCls.methods.some(m => m.ref == e.id));
        let checkMethodName = accessClsMethods.every(m => methodNames.includes(m.name));
        expect(checkMethodName).toBeTrue();
    });

    it("should have one access for method", async () => {
        let checkMethodHasAccess = accessClsMethods.every(m => m.accesses !== undefined);
        expect(checkMethodHasAccess).toBeTrue();

        accessClsMethods.forEach(method => {
            let accessClsAccess = parsedModel.filter(e => e.FM3 == "FamixTypeScript.Access"
                && method.accesses.some(m => m.ref == e.id));
            let checkHasRelatedToMethod = accessClsAccess.every(a => a.accessor !== undefined && a.accessor.ref == method.id);
            expect(checkHasRelatedToMethod).toBeTrue();
        });
    });

})