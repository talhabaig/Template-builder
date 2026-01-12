<template>
  <div class="variable-panel" @click.stop @touchstart.stop @touchend.stop>
    <div class="variable-panel-header">
      <div class="header-top">
        <h3>Variables</h3>
        <button
          v-if="showCloseButton"
          class="close-btn"
          @click.stop="closePanel"
          aria-label="Close variables panel"
        >
          ✕
        </button>
      </div>
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search variables..."
          class="search-input"
          ref="searchInput"
          @click.stop
          @focus.stop="handleSearchFocus"
          @touchstart.stop
          @touchend.stop
          @blur.stop
        />
      </div>
    </div>
    
    <div class="variable-categories">
      <div
        v-for="category in filteredCategories"
        :key="category.id"
        class="category-section"
      >
        <div
          class="category-header"
          @click.stop="toggleCategory(category.id)"
        >
          <span class="category-icon">{{ category.icon }}</span>
          <span class="category-name">{{ category.name }}</span>
          <span class="category-toggle">{{ expandedCategories[category.id] ? '▼' : '▶' }}</span>
        </div>
        
        <div
          v-show="expandedCategories[category.id]"
          class="category-variables"
        >
          <div
            v-for="variable in category.variables"
            :key="variable.id"
            class="variable-item"
          >
            <div
              v-if="!variable.isLoop"
              class="variable-simple"
              @click.stop="insertVariable(variable)"
              :title="variable.description || variable.label"
            >
              <span class="variable-label">{{ variable.label }}</span>
              <span class="variable-syntax">{{ variable.syntax }}</span>
            </div>
            
            <div
              v-else
              class="variable-loop"
            >
              <div
                class="variable-loop-header"
                @click.stop="toggleVariable(variable.id)"
              >
                <span class="variable-label">{{ variable.label }}</span>
                <span class="variable-toggle">{{ expandedVariables[variable.id] ? '▼' : '▶' }}</span>
              </div>
              
              <div
                v-show="expandedVariables[variable.id]"
                class="variable-loop-actions"
              >
                <button
                  class="btn-insert-loop"
                  @click.stop="insertLoop(variable)"
                >
                  Insert Loop
                </button>
              <div
                v-if="variable.innerVariables"
                class="inner-variables"
              >
                <div
                  v-for="innerVar in variable.innerVariables"
                  :key="innerVar.id"
                  class="variable-inner"
                  @click.stop="insertVariable(innerVar, variable)"
                  :title="innerVar.label"
                >
                    <span class="variable-label">{{ innerVar.label }}</span>
                    <span class="variable-syntax">{{ innerVar.syntax }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { variableCategories, getAllVariables } from '@/data/variables'

export default {
  name: 'VariablePanel',
  props: {
    showCloseButton: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      categories: variableCategories,
      searchQuery: '',
      expandedCategories: {},
      expandedVariables: {}
    }
  },
  computed: {
    filteredCategories() {
      if (!this.searchQuery) {
        return this.categories
      }
      
      const query = this.searchQuery.toLowerCase()
      const allVars = getAllVariables()
      const matchingVars = allVars.filter(v => 
        v.label.toLowerCase().includes(query) ||
        v.syntax.toLowerCase().includes(query)
      )
      
      // Filter categories to only show those with matching variables
      return this.categories.map(category => {
        const matching = category.variables.filter(v => {
          if (v.label.toLowerCase().includes(query) || v.syntax.toLowerCase().includes(query)) {
            return true
          }
          if (v.innerVariables) {
            return v.innerVariables.some(iv => 
              iv.label.toLowerCase().includes(query) ||
              iv.syntax.toLowerCase().includes(query)
            )
          }
          return false
        })
        
        return {
          ...category,
          variables: matching
        }
      }).filter(category => category.variables.length > 0)
    }
  },
  mounted() {
    // Expand all categories by default
    this.categories.forEach(cat => {
      this.$set(this.expandedCategories, cat.id, true)
    })
  },
  methods: {
    toggleCategory(categoryId) {
      this.$set(this.expandedCategories, categoryId, !this.expandedCategories[categoryId])
    },
    toggleVariable(variableId) {
      this.$set(this.expandedVariables, variableId, !this.expandedVariables[variableId])
    },
    insertVariable(variable, parentLoop = null) {
      this.$emit('insert-variable', {
        variable,
        parentLoop
      })
    },
    insertLoop(variable) {
      this.$emit('insert-loop', {
        variable
      })
    },
    closePanel() {
      this.$emit('close-panel')
    },
    handleSearchFocus(event) {
      // Prevent any parent handlers from closing the panel when search is focused
      // This ensures the panel stays open when user clicks to search
      if (event) {
        event.stopPropagation()
      }
    }
  }
}
</script>

<style scoped>
.variable-panel {
  width: 300px;
  min-width: 300px;
  height: 100%;
  background: #f8f9fa;
  border-right: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .variable-panel {
    width: 100%;
    min-width: 100%;
    height: auto;
    max-height: 60vh;
    border-right: none;
    border-bottom: 1px solid #dee2e6;
  }

  .variable-panel-header {
    padding: 12px;
  }

  .variable-panel-header h3 {
    font-size: 16px;
  }

  .category-header {
    padding: 10px 12px;
  }

  .variable-simple,
  .variable-inner {
    padding: 8px 12px 8px 24px;
  }

  .variable-label {
    font-size: 13px;
  }

  .variable-syntax {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .variable-panel {
    max-height: 55vh;
  }

  .variable-panel-header {
    padding: 10px;
  }

  .variable-panel-header h3 {
    font-size: 14px;
    margin-bottom: 8px;
  }

  .search-input {
    padding: 6px 10px;
    font-size: 13px;
  }

  .category-header {
    padding: 8px 10px;
    font-size: 13px;
  }

  .variable-simple,
  .variable-inner {
    padding: 6px 10px 6px 20px;
  }

  .variable-label {
    font-size: 12px;
  }

  .variable-syntax {
    font-size: 10px;
    padding: 1px 4px;
  }

  .btn-insert-loop {
    padding: 6px;
    font-size: 12px;
  }
}

.variable-panel-header {
  padding: 16px;
  border-bottom: 1px solid #dee2e6;
  background: white;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.variable-panel-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  flex: 1;
}

.close-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  padding: 0;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: #c82333;
}

.close-btn:active {
  background: #bd2130;
}

.search-box {
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.variable-categories {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
}

.category-section {
  margin-bottom: 4px;
}

.category-header {
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  display: flex;
  align-items: center;
  user-select: none;
  transition: background-color 0.2s;
}

.category-header:hover {
  background: #f8f9fa;
}

.category-icon {
  font-size: 18px;
  margin-right: 8px;
}

.category-name {
  flex: 1;
  font-weight: 500;
  color: #495057;
}

.category-toggle {
  color: #6c757d;
  font-size: 12px;
}

.category-variables {
  background: #ffffff;
}

.variable-item {
  border-bottom: 1px solid #f1f3f5;
}

.variable-simple,
.variable-inner {
  padding: 10px 16px 10px 32px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: background-color 0.2s;
}

.variable-simple:hover,
.variable-inner:hover {
  background: #e7f3ff;
}

.variable-label {
  font-size: 14px;
  color: #212529;
  margin-bottom: 4px;
}

.variable-syntax {
  font-size: 12px;
  color: #6c757d;
  font-family: 'Courier New', monospace;
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 3px;
  display: inline-block;
}

.variable-loop {
  border-top: 1px solid #e9ecef;
}

.variable-loop-header {
  padding: 10px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  user-select: none;
  transition: background-color 0.2s;
}

.variable-loop-header:hover {
  background: #f8f9fa;
}

.variable-loop-header .variable-label {
  flex: 1;
  margin: 0;
}

.variable-toggle {
  color: #6c757d;
  font-size: 12px;
}

.variable-loop-actions {
  padding: 8px 16px 8px 32px;
  background: #f8f9fa;
}

.btn-insert-loop {
  width: 100%;
  padding: 8px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
  transition: background-color 0.2s;
}

.btn-insert-loop:hover {
  background: #0056b3;
}

.inner-variables {
  margin-top: 8px;
}

.variable-inner {
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.variable-inner:last-child {
  border-bottom: none;
}
</style>
