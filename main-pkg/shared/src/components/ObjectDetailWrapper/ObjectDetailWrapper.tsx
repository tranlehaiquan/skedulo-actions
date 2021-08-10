import * as React from 'react'
import { ConfirmationModal, Icon, ITab, Tabs } from '@skedulo/sked-ui'
import _isEqual from 'lodash/fp/isEqual'

import { LoadingTrigger, useGlobalLoading } from '../GlobalLoading'

import { BaseObject } from '../../types'

interface ObjectDetailPage<T> {
  UID: string
  objectType: string
  objectListUrl: string
  getObject: (uid: string) => Promise<T>
  deleteObject?: (uid: string) => Promise<any>
  children: (activeTab: string) => React.ReactElement
  tabs: ITab[]
}

const ObjectDetailPage = <T extends BaseObject>({
  UID,
  objectType,
  objectListUrl,
  tabs,
  children,
  getObject,
  deleteObject,
}: ObjectDetailPage<T>) => {
  const { startGlobalLoading, endGlobalLoading } = useGlobalLoading()
  const [activeTab, setActiveTab] = React.useState<string>(tabs[0].route)
  const [objectDetail, setObjectDetail] = React.useState<T>()
  const [confirmDelete, setConfirmDelete] = React.useState<boolean>(false)

  const handleChangeTab = React.useCallback((tab: string) => {
    setActiveTab(tab)
  }, [])

  const handleDelete = React.useCallback(async () => {
    if (UID && deleteObject) {
      try {
        startGlobalLoading()
        await deleteObject(UID)
        window.top.window.location.href = objectListUrl
        // keep loading forever and wait for browser reload page
      } catch (err) {
        endGlobalLoading()
      }
    }
  }, [UID, deleteObject])

  const toggleConfirmDelete = React.useCallback(() => {
    setConfirmDelete((prev: boolean) => !prev)
  }, [])

  React.useEffect(() => {
    if (UID) {
      (async (): Promise<void> => {
        const res = await getObject(UID)

        if (res) {
          setObjectDetail(res)
        }
      })()
    } else {
      window.top.window.location.href = objectListUrl
    }
  }, [UID])

  if (!objectDetail) {
    return <LoadingTrigger />
  }

  return (
    <div className="page-view">
      <div className="crud-full-page">
        <div className="flex flex--vertical">
          <div className="section-header crud-full-page__header cx-pb-0">
            <a className="breadcrumb clickable" target="_top" href={objectListUrl}>
              <Icon name="chevronLeft" className="breadcrumb__icon" />
              <span className="breadcrumb__link capitalize">{objectType}</span>
            </a>
            <div className="cx-flex cx-justify-between cx-mb-6">
              <h1 className="cx-text-xl cx-font-semibold" data-sk-name="crud-details-page-title">
                {objectDetail.Name}
              </h1>
              {deleteObject && (
                <button data-sk-name="delete" className="sk-button-icon transparent" onClick={toggleConfirmDelete}>
                  <Icon name="trash" className="cx-text-neutral-500" />
                </button>
              )}
            </div>
            <Tabs tabs={tabs} currentActiveRoute={activeTab} onClick={handleChangeTab} />
          </div>
          {children(activeTab)}
        </div>
        {confirmDelete && (
          <ConfirmationModal onCancel={toggleConfirmDelete} onConfirm={handleDelete} confirmButtonText="Ok">
            Are you sure you want to delete {objectDetail.Name} from {objectType} ?
          </ConfirmationModal>
        )}
      </div>
    </div>
  )
}

export default ObjectDetailPage
