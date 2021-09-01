import * as React from 'react'
import { FormElementWrapper, FormLabel, AsyncSearchSelect, Button, PopOut } from '@skedulo/sked-ui'
import { Tags } from 'shared/dist/__graphql/graphql'
import { useGlobalLoading } from 'shared/dist/components/GlobalLoading'

import { dataService, searchObject } from '../../services/DataServices'
import { toastMessage } from '../../commons/utils'

interface AssignTagPopoutProp {
  trigger: React.ReactElement
  resourceId: string
  submitCb?: () => Promise<any>
  excludedTagIds: string[]
}

const AssignTagPopout: React.FC<AssignTagPopoutProp> = (props) => {
  const { trigger, resourceId, submitCb, excludedTagIds } = props
  const { startGlobalLoading, endGlobalLoading } = useGlobalLoading()

  const [selectedTag, setSelectedTag] = React.useState<Tags | null>(null)

  const fetchTagOptions = React.useCallback(
    async (searchTerm: string) => {
      const res = await searchObject('Tags', searchTerm)

      return res
        .filter((item) => !excludedTagIds.includes(item.UID))
        .map((item) => ({ ...item, value: item.UID, label: item.Name }))
    },
    [excludedTagIds]
  )

  const onSubmit = React.useCallback(
    async (callback) => {
      if (!selectedTag) {
        return
      }
      try {
        startGlobalLoading()
        const formData = {
          TagId: selectedTag?.UID || '',
          ResourceId: resourceId,
        }

        await dataService.insertResourceTag(formData)

        if (typeof callback === 'function') {
          callback()
        }
        if (typeof submitCb === 'function') {
          await submitCb()
        }
      } catch (error) {
        toastMessage.error(error.message)
      } finally {
        endGlobalLoading()
      }
    },
    [selectedTag, submitCb]
  )

  const onTagSelect = React.useCallback((selectedItem: any) => {
    setSelectedTag(selectedItem as Tags)
  }, [])

  return (
    <PopOut trigger={() => trigger}>
      {(hidePopout) => (
        <div className="cx-p-4 cx-bg-white cx-border">
          <div className="cx-mb-4">
            <FormLabel status="required">Tag</FormLabel>
            <FormElementWrapper>
              <AsyncSearchSelect
                name=""
                onSelectedItemChange={onTagSelect}
                fetchItems={fetchTagOptions}
                debounceTime={300}
                useCache
              />
            </FormElementWrapper>
          </div>
          <div className="cx-flex cx-justify-end border-top cx-pt-4 cx-bg-white cx-bottom-0 cx-sticky">
            <Button buttonType="secondary" onClick={hidePopout}>
              Cancel
            </Button>
            <Button
              buttonType="primary"
              className="cx-ml-2"
              onClick={async () => await onSubmit(hidePopout)}
              disabled={!selectedTag}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </PopOut>
  )
}

export default React.memo(AssignTagPopout)
