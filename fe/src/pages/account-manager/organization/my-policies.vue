<template>
  <a-flex vertical gap="20" align="center">
    <div class="account-manager-transparent-card">
      <a-button type="primary" shape="circle" size="large" style="height: 50px; width: 50px" @click="backward">
        <i class="fa-solid fa-chevron-left fs-5"></i>
      </a-button>
    </div>

    <a-card class="account-manager-card" :bordered="false">
      <a-skeleton :loading="pageLoading" active>
        <a-table
          class="account-manager-table"
          rowKey="id"
          :columns="policyColumns"
          :data-source="policyDataSource"
          :bordered="false"
          :showSorterTooltip="false"
          :expand-column-width="100"
          :scroll="{ x: true }">
          <template #title>
            <a-row>
              <a-col flex="1 1 300px">
                <p class="fs-4 fw-bold">
                  Quyền hạn của tôi
                  <span v-if="this.policyOriginDataSource" style="color: lightgray">
                    ({{ this.policyOriginDataSource.length }})
                  </span>
                </p>
              </a-col>
              <a-col flex="">
                <a-flex gap="middle"> </a-flex>
              </a-col>
            </a-row>
            <a-row>
              <a-col class="mt-1" :xs="24">
                <p style="font-size: 0.8rem">
                  Quyền của người dùng bao gôm quyền người dùng sở hữu theo cá nhân và quyền của phòng ban mà người dùng
                  là thành viên.
                </p>
              </a-col>
              <a-col :xs="24" :md="16">
                <a-input
                  v-model:value="policySearchValue"
                  class="mt-2"
                  placeholder="Tìm kiếm"
                  @change="policySearchChange">
                  <template #prefix>
                    <i class="fa-solid fa-magnifying-glass me-2"></i>
                  </template>
                </a-input>
              </a-col>
            </a-row>
          </template>

          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'name'">
              <a-button class="no-border-ant-button" ghost>
                <u style="text-underline-offset: 3px">
                  {{ record.name }}
                </u>
              </a-button>
            </template>
          </template>
        </a-table>
      </a-skeleton>
    </a-card>
  </a-flex>
</template>

<script>
import { defineComponent, inject, ref } from 'vue';
import { userState } from '@/stores/user-state';
import { removeAccents } from '@/js/utils/utils';

export default defineComponent({
  setup() {
    const pageLoading = inject('pageLoading');
    const userProfile = inject('userProfile');

    const policyOriginDataSource = ref();
    const policyDataSource = ref();

    if (userState().getLogin) {
      policyOriginDataSource.value = userProfile.value.allPolicies;
      policyDataSource.value = userProfile.value.allPolicies;
    }
    return {
      pageLoading,
      userProfile,
      policyOriginDataSource,
      policyDataSource,
    };
  },

  data() {
    return {
      policyColumns: [
        {
          title: 'Tên quyền hạn',
          dataIndex: 'name',
          key: 'name',
          sorter: (a, b) => a.name.length - b.name.length,
        },
        {
          title: 'Mô tả',
          dataIndex: 'description',
          key: 'description',
          sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
        },
      ],
      policySearchValue: '',
    };
  },

  watch: {
    pageLoading: {
      handler() {
        if (!this.pageLoading) {
          this.policyOriginDataSource = this.userProfile.allPolicies;
          this.policyDataSource = this.userProfile.allPolicies;
        } else {
          // this.dataSource = [];
        }
      },
      deep: false,
      once: true,
    },
  },

  computed: {},

  methods: {
    backward() {
      this.$router.push({
        name: 'account-manager-overview',
      });
    },

    filterTable(text, dataSource) {
      return dataSource.filter(function (item) {
        return removeAccents(item.name.toLowerCase()).includes(removeAccents(text.toLowerCase()));
      });
    },

    policySearchChange() {
      this.policyDataSource = this.filterTable(this.policySearchValue, this.policyOriginDataSource);
    },
  },

  mounted() {},
});
</script>

<style lang="scss"></style>
