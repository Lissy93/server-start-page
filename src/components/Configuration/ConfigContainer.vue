<template>
  <Tabs :navAuto="true" name="Add Item" ref="tabView">
    <TabItem name="Config" class="main-tab">
      <div class="main-options-container">
        <h2>Configuration Options</h2>
        <a class="hyperlink-wrapper"  @click="downloadConfigFile('conf.yml', yaml)">
          <button class="config-button center">
          <DownloadIcon class="button-icon"/>
          Download Config
          </button>
        </a>
        <button class="config-button center" @click="() => navigateToTab(2)">
          <EditIcon class="button-icon"/>
          Edit Config
        </button>
        <button class="config-button center" @click="() => navigateToTab(3)">
          <CustomCssIcon class="button-icon"/>
          Edit Custom CSS
        </button>
        <button class="config-button center" @click="openCloudSync()">
          <CloudIcon class="button-icon"/>
          {{backupId ? 'Edit Cloud Sync' : 'Enable Cloud Sync'}}
        </button>
        <button class="config-button center" @click="openRebuildAppModal()">
          <RebuildIcon class="button-icon"/>
          Rebuild Application
        </button>
        <button class="config-button center" @click="resetLocalSettings()">
          <DeleteIcon class="button-icon"/>
          Reset Local Settings
        </button>
        <button class="config-button center" @click="openAboutModal()">
          <IconAbout class="button-icon" />
          App Info
        </button>
        <p class="small-screen-note" style="display: none;">
            You are using a very small screen, and some screens in this menu may not be optimal
        </p>
        <p class="app-version">Dashy version {{ appVersion }}</p>
        <div class="config-note">
          <span>
            It is recommend to make a backup of your conf.yml file before making changes.
          </span>
        </div>
      </div>
      <!-- Rebuild App Modal -->
      <RebuildApp />
    </TabItem>
    <TabItem name="View Config" class="code-container">
      <pre id="conf-yaml">{{yaml}}</pre>
      <div class="yaml-action-buttons">
        <h2>Actions</h2>
        <a class="yaml-button download" @click="downloadConfigFile('conf.yml', yaml)">
          Download Config
        </a>
        <a class="yaml-button copy" @click="copyConfigToClipboard()">Copy Config</a>
        <a class="yaml-button reset" @click="resetLocalSettings()">Reset Config</a>
      </div>
    </TabItem>
    <TabItem name="Edit Config">
      <JsonEditor :config="config" />
    </TabItem>
    <TabItem name="Custom Styles">
      <CustomCssEditor :config="config" initialCss="hello" />
    </TabItem>
  </Tabs>
</template>

<script>

import hljs from 'highlight.js/lib/core';
import yaml from 'highlight.js/lib/languages/yaml';
import 'highlight.js/styles/mono-blue.css';

import JsonToYaml from '@/utils/JsonToYaml';
import { localStorageKeys, modalNames } from '@/utils/defaults';
import JsonEditor from '@/components/Configuration/JsonEditor';
import CustomCssEditor from '@/components/Configuration/CustomCss';
import RebuildApp from '@/components/Configuration/RebuildApp';

import DownloadIcon from '@/assets/interface-icons/config-download-file.svg';
import DeleteIcon from '@/assets/interface-icons/config-delete-local.svg';
import EditIcon from '@/assets/interface-icons/config-edit-json.svg';
import CustomCssIcon from '@/assets/interface-icons/config-custom-css.svg';
import CloudIcon from '@/assets/interface-icons/cloud-backup-restore.svg';
import RebuildIcon from '@/assets/interface-icons/application-rebuild.svg';
import IconAbout from '@/assets/interface-icons/application-about.svg';

export default {
  name: 'ConfigContainer',
  data() {
    return {
      jsonParser: JsonToYaml,
      backupId: localStorage[localStorageKeys.BACKUP_ID] || '',
      appVersion: process.env.VUE_APP_VERSION,
    };
  },
  props: {
    config: Object,
  },
  computed: {
    sections: function getSections() {
      return this.config.sections;
    },
    yaml() {
      return this.jsonParser(this.config);
    },
  },
  components: {
    JsonEditor,
    CustomCssEditor,
    RebuildApp,
    DownloadIcon,
    DeleteIcon,
    EditIcon,
    CloudIcon,
    CustomCssIcon,
    RebuildIcon,
    IconAbout,
  },
  methods: {
    /* Progamatically navigates to a given tab by index */
    navigateToTab(tabInxex) {
      const itemToSelect = this.$refs.tabView.navItems[tabInxex];
      this.$refs.tabView.activeTabItem(itemToSelect);
    },
    openRebuildAppModal() {
      this.$modal.show(modalNames.REBUILD_APP);
    },
    openAboutModal() {
      this.$modal.show(modalNames.ABOUT_APP);
    },
    openCloudSync() {
      this.$modal.show(modalNames.CLOUD_BACKUP);
    },
    copyConfigToClipboard() {
      navigator.clipboard.writeText(this.jsonParser(this.config));
      // event.target.textContent = 'Copied to clipboard';
    },
    /* Checks that the user is sure, then resets site-wide local storage, and reloads page */
    resetLocalSettings() {
      const msg = 'This will remove all user settings from local storage, '
          + 'but won\'t effect your \'conf.yml\' file. '
          + 'It is recommend to make a backup of your modified YAML settings first.\n\n'
          + 'Are you sure you want to proceed?';
      const isTheUserSure = confirm(msg); // eslint-disable-line no-alert, no-restricted-globals
      if (isTheUserSure) {
        localStorage.clear();
        this.$toasted.show('Data cleared succesfully');
        setTimeout(() => {
          location.reload(true); // eslint-disable-line no-restricted-globals
        }, 1900);
      }
    },
    /* Generates a new file, with the YAML contents, and triggers a download */
    downloadConfigFile(filename, filecontents) {
      const element = document.createElement('a');
      element.setAttribute('href', `data:text/plain;charset=utf-8, ${encodeURIComponent(filecontents)}`);
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
  },
  mounted() {
    hljs.registerLanguage('yaml', yaml);
    const highlighted = hljs.highlight(this.jsonParser(this.config), { language: 'yaml' }).value;
    document.getElementById('conf-yaml').innerHTML = highlighted;
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/style-helpers.scss';
@import '@/styles/media-queries.scss';

pre {
  color: var(--config-code-color);
  font-weight: bold !important;
  padding: 0.5rem 1rem;
}

a.config-button, button.config-button {
  display: flex;
  align-items: center;
  padding:  0.5rem 1rem;
  margin: 0.25rem auto;
  font-size: 1.2rem;
  background: var(--config-settings-background);
  color: var(--config-settings-color);
  border: 1px solid var(--config-settings-color);
  border-radius: var(--curve-factor);
  text-decoration: none;
  cursor: pointer;
  margin: 0.5rem auto;
  width: 18rem;
  svg.button-icon {
    path {
      fill: var(--config-settings-color);
    }
    width: 1rem;
    height: 1rem;
    padding: 0.2rem;
    margin-right: 0.5rem;
  }
  &:hover {
    background: var(--config-settings-color);
    color: var(--config-settings-background);
    svg path {
      fill: var(--config-settings-background);
    }
  }
}

p.app-version {
  margin: 0.5rem auto;
  font-size: 1rem;
  color: var(--transparent-white-50);
}

div.code-container {
  background: var(--config-code-background);
  #conf-yaml span {
    font-family: var(--font-monospace), monospace !important;
    &.hljs-attr {
      font-weight: bold !important;
    }
  }
  .yaml-action-buttons {
    position: absolute;
    top: 1.5rem;
    right: 0.5rem;
    display: flex;
    flex-direction: column;
    border: 1px dashed;
    padding: 0.5rem;
    border-radius: 4px;
    h2 {
      margin: 0;
      text-align: center;
      color: var(--config-code-color);
    }
    a.yaml-button {
      padding:  0.25rem 0.5rem;
      font-size: 1rem;
      color: var(--config-code-color);
      border-radius: var(--curve-factor);
      cursor: pointer;
      text-decoration: underline;
      border: 1px solid var(--config-code-background);
      &:hover {
        color: var(--config-code-color);
        border-color: var(--config-code-color);
        text-decoration: none;
      }
      &:active {
        color: var(--config-code-background);
        background-color: var(--config-settings-color);
        text-decoration: none;
      }
    }
  }
}

.tab-item {
  overflow-y: auto;
  @extend .scroll-bar;
  background: var(--config-settings-background);
  &.main-tab {
    min-height: 500px;
  }
}

a.hyperlink-wrapper {
  margin: 0 auto;
  text-decoration: none;
}

.main-options-container {
  display: flex;
  flex-direction: column;
  padding-top: 2rem;
  background: var(--config-settings-background);
  height: calc(100% - 2rem);
  h2 {
    margin: 0 auto 1rem auto;
    color: var(--config-settings-color);
  }
}

.config-note {
  width: 80%;
  position: absolute;
  bottom: 1rem;
  left: 10%;
  margin: 0.5rem auto;
  padding: 0.5rem 0.75rem;
  border: 1px dashed var(--config-settings-color);
  border-radius: var(--curve-factor);
  text-align: left;
  opacity: var(--dimming-factor);
  color: var(--config-settings-color);
  background: var(--config-settings-background);
  cursor: default;
  p.sub-title {
    font-weight: bold;
    margin: 0;
    display: inline;
  }
  &:hover { opacity: 1; }
  display: none;
  @include tablet-up { display: block; }
}
p.small-screen-note {
    @include phone {
      display: block !important;
    }
    margin: 0.5rem auto;
    padding: 0 0.5rem;
    text-align: center;
    opacity: 0.8;
    font-size: 0.9rem;
    color: var(--warning);
  }
</style>

<style lang="scss">

.tabs__content {
  height: -webkit-fill-available;
  height: -moz-available;
  height: stretch;
}

.tab-item {
  background: var(--config-settings-background) !important;
}

.tab__pagination {
  background: var(--config-settings-background) !important;
  color: var(--config-settings-color) !important;
  .tab__nav__items .tab__nav__item {
    span {
      color: var(--config-settings-color) !important;
    }
    &:hover {
      background: var(--config-settings-color) !important;
      span {
        color: var(--config-settings-background) !important;
      }
    }
    &.active {
      span {
        font-weight: bold !important;
        color: var(--config-settings-color) !important;
      }
    }
  }
  .tab__nav__items .tab__nav__item.active {
    border-bottom: 2px solid var(--config-settings-color) !important;
  }
  hr.tab__slider {
    background: var(--config-settings-color) !important;
  }
}

#conf-yaml {
  background: var(--white);
  .hljs-attr {
    color: #9c03f5;
  }
}

</style>
