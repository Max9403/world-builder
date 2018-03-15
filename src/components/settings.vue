<template>
    <div class="settings">
        <input id="settings-toggle" value="true" type="checkbox" checked class="is-hidden"/>
        <div class="settings-area">
            <label class="checkbox label">
                <input type="checkbox" v-model="currentSettings.border"/> Border?
            </label>
            <label class="label">Horizontal Tiles
                <input class="input" type="number" min="1" v-model.number="currentSettings.tiles.horizontal"/>
            </label>
            <label class="label">Vertical Tiles
                <input class="input" type="number" min="1" v-model.number="currentSettings.tiles.vertical"/>
            </label>
            <label class="label">Section Size
                <input class="input" type="number" min="1" v-model.number="currentSettings.resolution"/>
            </label>
            <button class="button is-success is-fullwidth" type="button" @click="setSettings">Save</button>
        </div>
        <div class="columns is-multiline">
            <div class="column is-half">
                <a href="#" class="button is-link is-fullwidth" @click="download">Download</a>
            </div>
            <div class="column is-half">
                <label for="settings-toggle" class="button is-primary is-fullwidth"></label>
            </div>
            <div class="column is-half">
                <button class="button is-info is-fullwidth" type="button" @click.prevent="showExport = true">Export
                </button>
            </div>
            <div class="column is-half">
                <button class="button is-warning is-fullwidth" type="button" @click.prevent="showImport = true">Import
                </button>
            </div>
            <div class="column is-full">
                <button class="button is-danger is-fullwidth" type="button">Reset</button>
            </div>
        </div>
        <modal :show="showExport" @hide="showExport = false">
            <pre>{{exported}}</pre>
            <a href="#" class="button is-link is-fullwidth" @click="exportJSON">Download</a>
        </modal>
        <modal class="import-content" :show="showImport" @hide="showImport = false">
            <div class="notification"
                 :class="{'is-success': importStatus == 'valid', 'is-warning': importStatus == 'missing', 'is-danger': importStatus == 'invalid'}">
                <template v-if="importStatus == 'valid'">
                    Import is valid
                </template>
                <template v-else-if="importStatus == 'missing'">
                    Missing values
                </template>
                <template v-else>
                    Invalid JSON
                </template>
                <pre contenteditable @input="storeImport">{{exported}}</pre>
            </div>
            <div class="columns">
                <div class="column">
                    <button class="button is-warning is-fullwidth" @click.prevent="loadImport"
                            :disabled="importStatus != 'valid'">Import
                    </button>
                </div>
                <div class="column">
                    <label class="button is-warning is-fullwidth" :class="{'is-loading': loadingFile}"
                           :disabled="loadingFile">
                        Load file
                        <input type="file" class="is-hidden" @change="loadFile"/>
                    </label>
                </div>
            </div>
        </modal>
    </div>
</template>

<style lang="scss">
    .settings {
        z-index: 20;
        position: fixed;
        top: 0;
        right: 0;
        background: #FFF;
        padding: 0.5rem;
        border-bottom-left-radius: 5px;
        width: 22rem;
        .modal-content {
            background: #FFF;
            padding: 0.75rem;
            border-radius: 5px;
        }
        .import-content {
            pre {
                border: solid 2px #4B4E4E;
                border-radius: 5px;
            }
        }
        .columns {
            margin: -0.25rem;
            .column {
                padding: 0.25rem;
            }
        }
        .settings-area {
            margin-bottom: 0.5rem;
        }
        #settings-toggle {
            ~ * [for="settings-toggle"]:after {
                content: "Show";
            }
            &:checked ~ * [for="settings-toggle"]:after {
                content: "Hide";
            }

            + .settings-area {
                max-height: 0;
                transition: max-height 500ms ease-out 0s, margin-bottom 200ms 500ms;
                overflow: hidden;
            }
            &:checked + .settings-area {
                transition: max-height 500ms ease-out 0s, margin-bottom 200ms 0s;
                max-height: 100vh;
            }
            &:not(:checked) + .settings-area {
                margin-bottom: 0;
            }
        }
    }
</style>

<script>
    import _ from 'lodash';
    import $ from 'jquery';
    import Zipper from 'adm-zip';

    import modal from './modal.vue';
    import eventBus from '../event-bus'

    export default {
        components: {
            modal
        },
        props: ["settings", "generator"],
        data() {
            return {
                parsed: {settings: this.$store.state.settings, flow: this.$store.state.flow},
                currentSettings: Object.assign({tiles: {}}, _.cloneDeep(this.settings)),
                showExport: false,
                showImport: false,
                importStatus: "valid",
                loadingFile: false
            };
        },
        computed: {
            exported() {
                return JSON.stringify({settings: this.$store.state.settings, flow: this.$store.state.flow}, null, 2)
            }
        },
        methods: {
            loadFile(e) {
                let $el = $(this.$el).find('.import-content pre');
                this.loadingFile = true;
                let reader = new FileReader();
                reader.onload = (e) => {
                    $el.html(e.target.result);
                    this.loadingFile = false;
                    this.storeImport({target: $el})
                };
                reader.readAsText(e.target.files[0])
            },
            storeImport(e) {
                try {
                    this.parsed = JSON.parse($(e.target).html());
                    this.importStatus = "valid";
                    if (!this.parsed.settings || !this.parsed.flow) {
                        this.importStatus = "missing"
                    }
                } catch (e) {
                    this.parsed = undefined;
                    this.importStatus = "invalid";
                }
            },
            loadImport() {
                if (this.parsed) {
                    this.$store.commit("setSettings", this.parsed.settings);
                    this.$store.commit("replaceFlow", this.parsed.flow);
                    this.currentSettings = this.parsed.settings;
                    this.showImport = false;
                    console.log(this.parsed)
                    eventBus.$emit("reload")
                }
            },
            setSettings() {
                this.$emit("changed", _.cloneDeep(this.currentSettings));
            },
            exportJSON(e) {
                let blob = new Blob([this.exported], {type: "octet/stream"});
                let url = URL.createObjectURL(blob);
                e.target.href = url;
                e.target.download = "export.json";
            },
            download(e) {
                let settings = this.settings;
                let resolution = settings.resolution;
                let maxX = settings.tiles.horizontal;
                let maxY = settings.tiles.vertical;
                let zip = new Zipper();
                for (let baseX = 0; baseX < maxX; baseX++) {
                    for (let baseY = 0; baseY < maxY; baseY++) {
                        let buffish = new Uint16Array(resolution * resolution);
                        for (let x = 0; x < resolution; x++) {
                            for (let y = 0; y < resolution; y++) {
                                let localX = x + baseX * resolution;
                                let localY = y + baseY * resolution;
                                let value = this.generator({x: localX, y: localY}) * 0xffff;
                                buffish[(x + y * resolution)] = value;
                            }
                        }
                        zip.addFile(`landscape_${baseX}_${baseY}_16bit.raw`, Buffer.from(buffish.buffer), '', 644 << 16);
                    }
                }
                let bufo = zip.toBuffer();
                let blob = new Blob([bufo], {type: "octet/stream"});
                let url = URL.createObjectURL(blob);
                e.target.href = url;
                e.target.download = "landscape.zip";
            }
        }
    }
</script>
