// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Type } from "./../famix/type";

export class Class extends Type {

  private classIsTestCase: boolean;

  // @FameProperty(name = "isTestCase")
  public getIsTestCase(): boolean {
    return this.classIsTestCase;
  }

  public setIsTestCase(classIsTestCase: boolean) {
    this.classIsTestCase = classIsTestCase;
  }

  private classIsInterface: boolean;

  // @FameProperty(name = "isInterface")
  public getIsInterface(): boolean {
    return this.classIsInterface;
  }

  public setIsInterface(classIsInterface: boolean) {
    this.classIsInterface = classIsInterface;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Class", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("isTestCase", this.getIsTestCase());
    exporter.addProperty("isInterface", this.getIsInterface());

  }

}

