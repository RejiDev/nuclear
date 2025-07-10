import { BehaviorContext } from "./Core/Behavior";
import BehaviorBuilder from "./Core/BehaviorBuilder";
import objMgr, { me } from "./Core/ObjectManager";
import { flagsComponents } from "./Core/Util";
import colors from "./Enums/Colors";
import { defaultHealTargeting } from "./Targeting/HealTargeting";
import { defaultCombatTargeting } from "./Targeting/CombatTargeting";
import commandListener from '@/Core/CommandListener'
import { renderBehaviorTree } from "./Debug/BehaviorTreeDebug";
import settings from "@/Core/Settings";
import KeyBinding from "@/Core/KeyBinding";
import drTracker from "./Core/DRTracker";

export let availableBehaviors = [];

// Make drTracker globally accessible
globalThis.drTracker = drTracker;

class Nuclear extends wow.EventListener {
  async initialize() {
    this.builder = new BehaviorBuilder();
    await this.builder.initialize();
    this.rebuild();
    this.isPaused = false;

    // Initialize DR tracker
    drTracker.initialize();

    // Set default keybinding for pause (Something noone will press)
    KeyBinding.setDefault("pause", imgui.Key.F9);
  }

  tick() {
    if (!this.gameReady()) {
      return;
    }
    if (this.error) {
      const text = "ERROR\n".repeat(5);
      const displaySize = imgui.io.displaySize;
      const center = {x: displaySize.x / 2, y: displaySize.y / 2};
      const textSize = imgui.calcTextSize(text);
      const adjusted = {x: center.x - textSize.x / 2, y: center.y - textSize.y / 2};
      imgui.getBackgroundDrawList()?.addText(text, adjusted, colors.red);
      return;
    }

    // Don't process key presses if we're in key binding mode
    if (!KeyBinding.isBinding()) {
      // Check for pause key press using the new KeyBinding system
      if (KeyBinding.isPressed("pause")) {
        this.isPaused = !this.isPaused;
        console.info(`Rotation ${this.isPaused ? 'paused' : 'resumed'}`);
      }
    }

    // Draw pause indicator if paused
    if (this.isPaused) {
      const pauseText = "ROTATION PAUSED";
      const displaySize = imgui.io.displaySize;
      const center = {x: displaySize.x / 2, y: displaySize.y / 2};
      const textSize = imgui.calcTextSize(pauseText);
      const adjusted = {x: center.x - textSize.x / 2, y: center.y - textSize.y / 2};
      imgui.getBackgroundDrawList()?.addText(pauseText, adjusted, colors.yellow);
    }

    try {
      defaultHealTargeting?.update();
      defaultCombatTargeting?.update();
      drTracker.update();
      if (this.behaviorRoot && !this.isPaused) {
        this.behaviorRoot.execute(this.behaviorContext);
      }
    } catch (e) {
      this.error = true;
      this.behaviorRoot = null;
      console.error(`${e.message}`);
      console.error(`${e.stack}`);
    }
  }

  // Add method to render keybinding UI
  renderKeybindingUI() {
    imgui.text("Configure Hotkeys");
    imgui.separator();

    // Group layout
    if (imgui.collapsingHeader("Core Controls", imgui.TreeNodeFlags.DefaultOpen)) {
      // Add pause rotation key binding button
      KeyBinding.button("pause", "Pause Rotation");

      // Add pause core key binding button
      KeyBinding.button("pauseCore", "Pause Application");

      // Add toggle window key binding button
      KeyBinding.button("toggleWindow", "Toggle Nuclear Window");

      // Add toggle debug window button
      KeyBinding.button("toggleDebug", "Toggle Debug Window");
    }

    // Info about key binding
    imgui.spacing();
    imgui.separator();
    imgui.spacing();

    // Display binding status
    if (KeyBinding.isBinding()) {
      imgui.pushStyleColor(imgui.Col.Text, [1.0, 0.8, 0.0, 1.0]); // Yellow
      imgui.text("Press a key combination to bind (ESC to cancel)...");
      imgui.popStyleColor();
    } else {
      imgui.textWrapped("Click on a button and press any key combination to rebind. Press ESC to cancel binding.");
    }

    imgui.spacing();

    // Add reset buttons
    if (imgui.button("Reset All to Defaults")) {
      KeyBinding.resetAll();
    }

    // Add note about reserved keys
    imgui.spacing();
    imgui.textWrapped("Note: ESC is reserved for canceling binding mode and cannot be bound.");
  }

  rebuild() {
    objMgr.tick();
    if (me) {
      console.info('Rebuilding behaviors');

      const { root, settings } = this.builder.build(wow.SpecializationInfo.activeSpecializationId, BehaviorContext.Normal);
      this.behaviorRoot = root;
      this.behaviorContext = {};
      this.behaviorSettings = settings;
      availableBehaviors = this.builder.behaviors;
      defaultHealTargeting?.reset();
    }
  }

  onEvent(event) {
    if (event.name == 'PLAYER_ENTERING_WORLD') {
      this.rebuild();
    }
  }

  gameReady() {
    if (wow.GameUI.state != this.previous_state) {
      console.debug(`state changed to ${flagsComponents(wow.GameUI.state, 16)}`);
      this.previous_state = wow.GameUI.state;
    }
    // XXX: figure out game state flags, 0x211 is "in game" mask for retail
    if (wow.GameUI.state != 0x211) {
      return false;
    }

    return me ? true : false;
  }
}

export default new Nuclear();
