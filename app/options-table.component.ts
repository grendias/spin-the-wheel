import {Component} from "@angular/core";
import {OptionService, Option} from "./option.service";
import {ColorPickerDirective} from './color-picker/color-picker.directive'

@Component({
    selector: 'options-table',
    template: `
        <button class="btn btn-primary pull-right" (click)="addNewOption()"><span class="glyphicon glyphicon-plus-sign"></span> Agregar opción</button>

        <table id="optionsTable" class="table">
            <thead>
                <th>Opción</th>
                <th>Color</th>
                <th></th>
            </thead>
            <tbody>
                <tr *ngFor="let option of options; let i = index">
                    <td class="option-description">
                        <span *ngIf="editModeRow != i">{{ option.name }}</span>
                        <input class="form-control" *ngIf="editModeRow == i" [(ngModel)]="option.name" type="text" value="{{ option.name }}">
                    </td>
                    <td width="130">
                        <span *ngIf="editModeRow != i" class="option-color-display" [ngStyle]="{'background-color': option.color}"></span>
                        <button *ngIf="editModeRow == i" class="btn" [(colorPicker)]="option.color" [value]="option.color" [cpPosition]="'bottom'" type="button"><span class="option-color-display-sm" [ngStyle]="{'background-color': option.color}"></span></button>
                    </td>
                    <td width="100">
                        <button *ngIf="editModeRow != i" class="btn delete-option-btn pull-left" (click)="onDelete(option, i)"><span class="glyphicon glyphicon-trash"></span></button>
                        <button *ngIf="editModeRow != i" class="btn edit-option-btn pull-left" (click)="onEdit(i)"><span class="glyphicon glyphicon-pencil"></span></button>
                        <button *ngIf="editModeRow == i" class="btn save-option-btn pull-left" (click)="onSave(i, option)"><span class="glyphicon glyphicon-floppy-disk"></span></button>
                        <button *ngIf="editModeRow == i" class="btn cancel-option-btn pull-left" (click)="onCancelEdit()"><span class="glyphicon glyphicon glyphicon-remove"></span></button>
                    </td>
                </tr>
            </tbody>
        </table>
    `,
    providers: [OptionService],
    directives: [ColorPickerDirective]
})

export class OptionsTableComponent {
    options: Option[];
    editModeRow = null;
    previousEditRowValues = null;

    constructor(private optionService: OptionService) {
        this.options = this.optionService.getOptions();
    }

    addNewOption() {
        this.options.push(new Option('', '#fff'));
        this.editModeRow = this.options.length - 1;
    }

    onDelete(option: Option, index: number) {
        if (confirm('¿Esta seguro de borrar la opción "'+ option.name +'"?')) {
            this.optionService.deleteOption(index);
            this.options = this.optionService.getOptions();
        }
    }

    onEdit(index: number) {
        this.restorePreviousValues();
        this.turnOnEditRowMode(index);
    }

    onSave(index: number, option: Option) {
        this.optionService.saveOption(index, option);
        this.turnOffEditMode();
    }

    onCancelEdit() {
        this.restorePreviousValues();
        this.turnOffEditMode();
    }

    private turnOnEditRowMode(index: number) {
        let currentOption = this.options[index];
        this.previousEditRowValues = {
            name: currentOption.name,
            color: currentOption.color
        };
        this.editModeRow = index;
    }

    private turnOffEditMode() {
        this.editModeRow = null;
        this.previousEditRowValues = null;
    }

    private restorePreviousValues() {
        if (this.previousEditRowValues != null && this.editModeRow != null) {
            this.options[this.editModeRow] = new Option(this.previousEditRowValues.name, this.previousEditRowValues.color);
            this.previousEditRowValues = null;
        }
    }
}